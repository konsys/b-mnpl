import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { playersStore } from 'src/stores/players.store';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get()
  async get(): Promise<UsersEntity[]> {
    return Promise.resolve(playersStore.getState().players);
  }

  @Post()
  async post(): Promise<UsersEntity[]> {
    return this.service.saveUsers();
  }
}
