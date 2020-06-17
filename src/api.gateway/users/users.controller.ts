import { Controller, Get } from '@nestjs/common';
import { MsNames } from 'src/types/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { playersStore } from 'src/stores/players.store';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async get(): Promise<UsersEntity[]> {
    const players = playersStore.getState().players;
    return Promise.resolve(players);
  }
  z;
}
