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

@Controller(MsNames.USERS)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
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
  async getProfile(
    @Request() req: RequestWithUser,
    @Param() { id }: { id: string },
  ): Promise<UsersEntity> {
    return new UsersEntity(
      await this.service.getUser(id ? Number.parseInt(id) : req.user.userId),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('init')
  async get(
    @Query('ids') ids: Array<number>,
    @Query('gameId') gameId: string,
  ): Promise<UsersEntity[]> {
    try {
      let players = await this.service.getUsersByIds(ids);

      // kkk
      players = await this.service.initPlayers(gameId, players);

      return players;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post()
  async post(): Promise<any[]> {
    return this.service.saveUsers();
    // return [];
  }
}
