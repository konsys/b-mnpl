import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { BOARD_PARAMS } from 'src/params/board.params';
import { OutcomeMessageType } from 'src/types/board/board.types';
import { nanoid } from 'nanoid';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const res = await this.service.getUser(req.user.userId);
    return new UsersEntity(res);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async get(@Query('ids') ids): Promise<UsersEntity[]> {
    let players = await this.service.getUsersByIds(ids);
    console.log(2222, players);
    players = await this.service.initPlayers('kkk', players);

    return players;
  }

  @Post()
  async post(): Promise<any[]> {
    // return this.service.saveUsers();
    return [];
  }
}
