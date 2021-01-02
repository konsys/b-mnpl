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
  async saveUser(
    @Body() user: UsersEntity,
  ): Promise<{ email: string | null; code: string }> {
    const emailIsRegistered = await this.service.getUserByEmail(user.email);

    // if (emailIsRegistered) {
    //   throw new BadRequestException('User exists');
    // }

    const registrationCode = nanoid();

    // await this.mailerService.sendMail({
    //   to: 'CatsPets88@yandex.ru', // List of receivers email address
    //   from: 'CatsPets88@yandex.ru', // Senders email address
    //   subject: 'Testing Nest MailerModule ✔', // Subject line
    //   text: registrationCode, // plaintext body
    //   html: `<b>${registrationCode}</b>`, // HTML body content
    // });

    const saveUser: UsersEntity = {
      ...user,
      registrationCode,
    };

    const res = new UsersEntity(await this.service.saveUser(saveUser));
    return {
      email: res ? saveUser.email : null,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register/code')
  async saveCode(@Body() code: string, @Body() email: string): Promise<any> {
    const res = new UsersEntity(await this.service.activateUser(code, email));
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
}
