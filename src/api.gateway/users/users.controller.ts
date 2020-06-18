import { Controller, Get, Post } from '@nestjs/common';
import { MsNames } from 'src/types/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { playersStore } from 'src/stores/players.store';
import { BANK_PLAYER_ID } from 'src/utils/board.params';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async get(): Promise<UsersEntity[]> {
    const players = playersStore
      .getState()
      .players.filter((v) => v.userId !== BANK_PLAYER_ID);
    console.log('players', players);
    return Promise.resolve(players);
  }

  @Post()
  async post(): Promise<UsersEntity[]> {
    return this.service.saveUsers();
  }
}
