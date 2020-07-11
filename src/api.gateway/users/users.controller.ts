import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { playersStore } from 'src/stores/players.store';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const res = this.service.getUser(req.user.userId);
    return res;
  }

  @Get()
  async get(@Query() ids): Promise<UsersEntity[]> {
    console.log(ids);
    return Promise.resolve(playersStore.getState().players);
  }

  @Post()
  async post(): Promise<UsersEntity[]> {
    return this.service.saveUsers();
  }
}
