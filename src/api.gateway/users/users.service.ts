import { IPlayer } from 'src/types/Board/board.types';
import { Injectable, Logger, Inject } from '@nestjs/common';

import { BOARD_PARAMS } from 'src/params/board.params';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/MS/ms.types';
import { StoreService } from '../action/store.service';
import { UsersEntity } from 'src/entities/users.entity';
import { users } from 'src/entities/dbData';

export interface IPlayersStore {
  version: number;
  players: IPlayer[];
}

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @Inject(MsNames.USERS)
    private readonly proxy: ClientProxy,
  ) {}

  async getAllUsers(filter?: FindManyOptions) {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsPatterns.GET_ALL_USERS }, filter || { take: 2 })
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async getUserByCredentials(email: string, password: string) {
    try {
      const res = await this.proxy
        .send<any>(
          { cmd: MsPatterns.GET_USER_BY_CREDENTIALS },
          { email, password },
        )
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async getUser(userId: number | null): Promise<any> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsPatterns.GET_USER }, { userId })
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async getUsersByIds(userIds: number[]): Promise<UsersEntity[]> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsPatterns.GET_USERS_BY_IDS }, { userIds })
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveUsers() {
    try {
      return await this.proxy
        .send<any>({ cmd: MsPatterns.SAVE_USERS }, users)
        .toPromise();
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
