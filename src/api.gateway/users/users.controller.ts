import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Body,
  Param,
} from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequestWithUser } from '../../types/board/board.types';
import { IJwtPayload, jwtConstants } from 'src/modules/auth/jwt.params';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid';
import { userRedis } from 'src/main';
import { BOARD_PARAMS } from 'src/params/board.params';
import { GAME_PARAMS } from 'src/params/game.params';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request() req: RequestWithUser,
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(req.user);
  }

  @Post('auth/logout')
  async logout(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<boolean> {
    return await this.service.logout(refreshToken);
  }

  @Post('auth/refresh')
  async refresh(
    @Body() { accessToken }: { accessToken: string },
  ): Promise<{ accessToken: string | null }> {
    const token = await this.service.getToken(accessToken);
    const dt = new Date().getTime();
    if (token && new Date(token.expires).getTime() >= dt) {
      const payload: IJwtPayload = this.authService.createPayload(
        token.name,
        token.userId,
      );
      const accessToken = await this.authService.signJwt(payload);

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + jwtConstants.refreshExpires);
      token.expires = expires;
      await this.service.saveToken(token.token, token.userId, token.name);

      return { accessToken };
    }
    if (token) {
      await this.service.deleteToken(accessToken);
    }

    return { accessToken: '' };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser): Promise<UsersEntity> {
    return new UsersEntity(await this.service.getUser(req.user.userId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfileById(@Param('id') userId: number): Promise<UsersEntity> {
    const res = new UsersEntity(await this.service.getUser(userId));
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('init')
  async get(
    @Query('ids') ids: Array<number>,
    @Query('gameId') gameId: string,
  ): Promise<UsersEntity[]> {
    try {
      let players = await this.service.getUsersByIds(ids);

      players = await this.service.initPlayers(gameId, players);

      return players;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async saveUser(@Body() user: UsersEntity): Promise<{ email: string | null }> {
    const emailIsRegistered = await this.service.getUserByEmail(user.email);

    if (emailIsRegistered && !!emailIsRegistered.isActive) {
      throw new BadRequestException('User is already registered');
    }

    const isRegistrationCode = await this.getRedis(user.email);
    // Not send email with code (redis TTL)
    if (emailIsRegistered && isRegistrationCode) {
      await this.service.updateUser({
        ...user,
        userId: emailIsRegistered.userId,
      });

      return {
        email: user.email ? user.email : '',
      };
    }

    const registrationCode = nanoid(4);

    await this.sendCodeToEmail(user.email, registrationCode);

    const saveUser: UsersEntity = {
      ...user,
      registrationCode,
    };

    let res = null;
    if (emailIsRegistered) {
      res = new UsersEntity(
        await this.service.updateUser({
          ...saveUser,
          userId: emailIsRegistered.userId,
        }),
      );
    } else {
      res = new UsersEntity(await this.service.saveUser(saveUser));
    }
    return {
      email: res ? saveUser.email : null,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register/code')
  async saveCode(
    @Body()
    { registrationCode, email }: { registrationCode: string; email: string },
  ): Promise<any> {
    const emailIsRegistered = await this.service.getUserByEmail(email);

    if (emailIsRegistered && !!emailIsRegistered.isActive) {
      throw new BadRequestException('User is already registered');
    }

    const res = await this.service.activateUser(registrationCode, email);

    if (!res) {
      throw new BadRequestException('Code is wrong');
    }
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register/code/resend')
  async resendCode(
    @Body()
    { email }: { email: string },
  ): Promise<any> {
    const emailIsRegistered = await this.service.getUserByEmail(email);

    if (emailIsRegistered && !emailIsRegistered.isActive) {
      const isEmailPending = await this.getRedis(email);
      if (isEmailPending) {
        throw new BadRequestException('Email send period not completed');
      }
      return true;
    } else {
      throw new BadRequestException('Email not found');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('email/:email')
  async getUserByEmail(
    @Param() email: string,
  ): Promise<UsersEntity | undefined> {
    return await this.service.getUserByEmail(email);
  }

  @Post()
  async saveUsers(): Promise<UsersEntity[]> {
    return this.service.saveUsers();
  }

  private async setRedis(key: string, data: any) {
    const isKey = await this.getRedis(key);
    if (isKey) {
      await userRedis.del(key);
    }
    await userRedis.set(key, JSON.stringify(data));
    await userRedis.expire([key, GAME_PARAMS.REGISTRATION_CODE_TTL]);
  }

  private async getRedis(key: string): Promise<any> {
    const data = JSON.parse(await userRedis.get(key));
    return data;
  }
  private async sendCodeToEmail(email: string, code: string) {
    await this.setRedis(email, code);
    return await this.mailerService.sendMail({
      to: 'CatsPets88@yandex.ru', // List of receivers email address
      from: 'CatsPets88@yandex.ru', // Senders email address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: code, // plaintext body
      html: `<b>${code}</b>`, // HTML body content
    });
  }
}
