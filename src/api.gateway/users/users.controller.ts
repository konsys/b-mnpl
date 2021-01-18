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
  Delete,
} from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RequestWithUser } from '../../types/board/board.types';
import { IJwtPayload, jwtConstants } from 'src/config/config';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid';
import { userRedis } from 'src/main';
import { GAME_PARAMS } from 'src/params/game.params';
import { ErrorCode } from 'src/utils/error.code';

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
    const login = await this.authService.login(req.user);

    return login;
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
    const profile = new UsersEntity(
      await this.service.getUser(req.user.userId),
    );
    return profile;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfileById(@Param('id') userId: number): Promise<UsersEntity> {
    const res = new UsersEntity(await this.service.getUser(userId));
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('creds')
  async getProfileByEmail(@Query('email') email: string): Promise<UsersEntity> {
    const res = new UsersEntity(await this.service.getUserByEmail(email));
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('init')
  async get(
    @Query('ids') ids: Array<number>,
    @Query('gameId') gameId: string,
  ): Promise<UsersEntity[]> {
    let players = await this.service.getUsersByIds(ids);

    players = await this.service.initPlayers(gameId, players);

    return players;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async saveUser(
    @Body() user: UsersEntity,
  ): Promise<{ email: string | null; registrationCode: string | null }> {
    const isUser = await this.service.getUserByEmail(user.email);

    if (isUser && isUser.isActive) {
      throw new BadRequestException(ErrorCode.UserExists);
    }

    let res = null;
    const newCode = nanoid(4);

    const saveUser: UsersEntity = {
      email: user.email,
      password: user.password,
      isTestUser: user.isTestUser,
      name: user.name,
      registrationCode: newCode,
    };

    if (!isUser) {
      res = new UsersEntity(await this.service.saveUser(saveUser));

      await this.sendCodeToEmail(user.email, newCode, saveUser.isTestUser);

      return {
        email: res ? res.email : null,
        registrationCode: saveUser.isTestUser ? newCode : null,
      };
    } else {
      await this.service.updateUser({
        ...isUser,
        email: user.email,
        password: user.password,
        isTestUser: user.isTestUser,
        name: user.name,
        userId: isUser.userId,
      });

      return {
        email: isUser.email,
        registrationCode: user.isTestUser ? isUser.registrationCode : null,
      };
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register/code')
  async saveCode(
    @Body()
    { registrationCode, email }: { registrationCode: string; email: string },
  ): Promise<UsersEntity> {
    const emailIsRegistered = await this.service.getUserByEmail(email);

    if (emailIsRegistered && !!emailIsRegistered.isActive) {
      throw new BadRequestException(ErrorCode.UserExists);
    }

    const res = await this.service.activateUser(registrationCode, email);

    if (!res) {
      throw new BadRequestException(ErrorCode.RegCodeWrong);
    }
    return res;
  }

  @Post('login/vk')
  async loginVk(
    @Body()
    { code }: { code: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = new UsersEntity(await this.service.loginVK(code));
    const res = await this.authService.login(user);
    return res;
  }

  @Post('register/code/resend')
  async resendCode(
    @Body()
    { email }: { email: string },
  ): Promise<boolean> {
    const emailIsRegistered = await this.service.getUserByEmail(email);

    if (emailIsRegistered && !emailIsRegistered.isActive) {
      const isEmailPending = await this.getRedis(email);

      if (isEmailPending) {
        throw new BadRequestException(ErrorCode.RegCodePeriodNotCompleted);
      } else {
        await this.sendCodeToEmail(
          emailIsRegistered.email,
          emailIsRegistered.registrationCode,
          emailIsRegistered.isTestUser,
        );
      }
      return true;
    } else {
      throw new BadRequestException(ErrorCode.EmailNotFound);
    }
  }

  @Delete('/:userId')
  async deleteUser(
    @Param()
    { userId }: { userId: number },
  ): Promise<any> {
    const res = await this.service.deleteUser(userId);
    return res;
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
  private async sendCodeToEmail(email: string, code: string, isTest: boolean) {
    await this.setRedis(email, code);
    return !isTest
      ? await this.mailerService.sendMail({
          to: 'CatsPets88@yandex.ru', // List of receivers email address
          from: 'CatsPets88@yandex.ru', // Senders email address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: code, // plaintext body
          html: `<b>${code}</b>`, // HTML body content
        })
      : true;
  }
}
