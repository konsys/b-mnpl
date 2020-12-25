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

  @Post('auth/refresh')
  async refresh(
    @Request() refreshToken: string,
  ): Promise<{ accessToken: string | null }> {
    const user = await this.service.getToken(refreshToken);
    if (user) {
      const payload: IJwtPayload = this.authService.createPayload(
        user.name,
        user.userId,
      );
      const accessToken = await this.authService.signJwt(
        payload,
        jwtConstants.secret,
        jwtConstants.expires,
      );
      return { accessToken };
    }
    return null;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser): Promise<UsersEntity> {
    return new UsersEntity(await this.service.getUser(req.user.userId));
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
