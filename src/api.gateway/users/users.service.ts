import { IPlayer } from 'src/types/board/board.types';
import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import {
  MsUsersPatterns,
  MsNames,
  MsActionsPatterns,
} from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { users } from 'src/entities/dbData';
import { TokensEntity } from 'src/entities/tokens.entity';
import { IVkUserResponce } from 'src/types/game/game.types';
import { ErrorCode } from 'src/utils/error.code';

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

  async getAllUsers(filter?: FindManyOptions): Promise<UsersEntity[]> {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_ALL_USERS }, filter)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async getUser(userId: number): Promise<UsersEntity | undefined> {
    if (!userId) {
      throw new BadRequestException({ code: ErrorCode.UserDoesntExists });
    }
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, userId)
      .toPromise();

    return res;
  }

  async initPlayers(
    gameId: string,
    players: UsersEntity[],
  ): Promise<UsersEntity[]> {
    const res = await this.actionsMs
      .send<any>({ cmd: MsActionsPatterns.INIT_PLAYERS }, { gameId, players })
      .toPromise();

    return res;
  }

  async getUsersByIds(userIds: number[]): Promise<UsersEntity[]> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_USERS_BY_IDS }, userIds)
      .toPromise();

    return res;
  }

  async getUserByCredentials(
    email: string,
    password: string,
  ): Promise<UsersEntity> {
    const res = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.GET_USER_BY_CREDENTIALS },
        { email, password },
      )
      .toPromise();
    return res;
  }

  async getUserByEmail(email: string): Promise<UsersEntity> {
    const res = await this.proxy
      .send<UsersEntity>(
        { cmd: MsUsersPatterns.GET_USER_BY_CREDENTIALS },
        { email },
      )
      .toPromise();

    return res;
  }

  async updateUser(user: UsersEntity): Promise<UsersEntity> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.UPDATE_USER }, user)
      .toPromise();

    return res;
  }

  async saveUser(user: UsersEntity): Promise<UsersEntity> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.SAVE_USER }, user)
      .toPromise();

    return res;
  }

  async activateUser(
    registrationCode: string,
    email: string,
  ): Promise<UsersEntity> {
    const res = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.ACTIVATE_USER },
        { registrationCode, email },
      )
      .toPromise();

    return res;
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

  async loginVK(code: string): Promise<UsersEntity | null> {
    return await this.proxy
      .send<any>({ cmd: MsUsersPatterns.LOGIN_VK }, code)
      .toPromise();
  }

  async getToken(userId: string): Promise<TokensEntity | null> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN }, userId)
      .toPromise();
    return res;
  }

  async saveToken(
    token: string,
    userId: number,
    name: string,
  ): Promise<boolean> {
    const res = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.SAVE_REFRESH_TOKEN },
        { token, userId, name },
      )
      .toPromise();
    return res;
  }

  async deleteToken(token: string): Promise<boolean> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.DELETE_REFRESH_TOKEN }, token)
      .toPromise();
    return res;
  }

  async logout(token: string): Promise<boolean> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.DELETE_REFRESH_TOKEN }, token)
      .toPromise();
    return res;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const res = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.DELETE_USER }, userId)
      .toPromise();
    return res;
  }
}
