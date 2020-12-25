import { IPlayer } from 'src/types/board/board.types';
import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import {
  MsUsersPatterns,
  MsNames,
  MsActionsPatterns,
} from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { users } from 'src/entities/dbData';

export interface IPlayersStore {
  players: IPlayer[];
}

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @Inject(MsNames.USERS)
    private readonly proxy: ClientProxy,
    @Inject(MsNames.ACTIONS)
    private readonly actionsMs: ClientProxy,
  ) {}

  async getAllUsers(filter?: FindManyOptions) {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_ALL_USERS }, filter)
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
          { cmd: MsUsersPatterns.GET_USER_BY_CREDENTIALS },
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
        .send<any>({ cmd: MsUsersPatterns.GET_USER }, { userId })
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async initPlayers(gameId: string, players: UsersEntity[]): Promise<any> {
    const res = await this.actionsMs
      .send<any>({ cmd: MsActionsPatterns.INIT_PLAYERS }, { gameId, players })
      .toPromise();

    return res;
  }

  async getUsersByIds(userIds: number[]): Promise<UsersEntity[]> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_USERS_BY_IDS }, userIds)
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveUsers(): Promise<UsersEntity[]> {
    try {
      return await this.proxy
        .send<any>({ cmd: MsUsersPatterns.SAVE_USERS }, users)
        .toPromise();
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async getToken(userId: string): Promise<UsersEntity | null> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN }, userId)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveToken(
    token: string,
    userId: number,
    userName: string,
  ): Promise<any> {
    try {
      const res = await this.proxy
        .send<any>(
          { cmd: MsUsersPatterns.SAVE_REFRESH_TOKEN },
          { token, userId, userName },
        )
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async deleteToken(userId: string): Promise<any> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.DELETE_REFRESH_TOKEN }, userId)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
