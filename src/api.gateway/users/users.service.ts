import { Inject, Logger, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/MS/ms.types';

import { users } from 'src/entities/dbData';
import { UsersEntity } from 'src/entities/users.entity';
import { IPlayer, OutcomeMessageType } from 'src/types/Board/board.types';
import { redis } from 'src/main';
import { BOARD_PARAMS } from 'src/params/board.params';
import { nanoid } from 'nanoid';
import { StoreService } from '../action/store.service';

export interface IPlayersStore {
  version: number;
  players: IPlayer[];
}

const bank: IPlayer = {
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 100000,
  password: 'bank',
  vip: true,
  registrationType: 'none',
  name: 'BANK',
  email: 'b@b.ru',
  team: null,
  avatar: '',
  createdAt: new Date('2020-06-17T12:08:38.000Z'),
  updatedAt: new Date('2020-06-17T12:08:38.000Z'),
  isActive: false,
  isBlocked: true,
  isActing: false,
  gameId: '',
  doublesRolledAsCombo: 0,
  jailed: 0,
  unjailAttempts: 0,
  meanPosition: 0,
  creditPayRound: false,
  creditNextTakeRound: 0,
  score: 0,
  additionalTime: 0,
  timeReduceLevel: 0,
  creditToPay: 0,
  canUseCredit: false,
  moveOrder: 0,
  isAlive: false,
  movesLeft: 0,
};

@Injectable()
export class UsersService {
  // private logger: Logger = new Logger('UsersService');
  constructor(
    // private readonly proxy: ClientProxy,
    private readonly store: StoreService,
  ) {}

  onModuleInit() {
    this.setBankStore('bankStore', bank);
  }

  async getAllUsers(filter?: FindManyOptions) {
    return [];
    // try {
    //   const res = await this.proxy
    //     .send<any>({ cmd: MsPatterns.GET_ALL_USERS }, filter || { take: 2 })
    //     .toPromise();

    //   return res;
    // } catch (err) {
    //   this.logger.log(`Error: ${err}`);
    // }
  }

  async getUserByCredentials(email: string, password: string) {
    return [];
    // try {
    //   const res = await this.proxy
    //     .send<any>(
    //       { cmd: MsPatterns.GET_USER_BY_CREDENTIALS },
    //       { email, password },
    //     )
    //     .toPromise();

    //   return res;
    // } catch (err) {
    //   this.logger.log(`Error: ${err}`);
    // }
  }

  async getUser(userId: number | null): Promise<any> {
    // try {
    //   const res = await this.proxy
    //     .send<any>({ cmd: MsPatterns.GET_USER }, { userId })
    //     .toPromise();

    //   return res;
    // } catch (err) {
    //   this.logger.log(`Error: ${err}`);
    // }
    return {};
  }

  async getUsersByIds(userIds: number[]): Promise<UsersEntity[]> {
    // try {
    //   const res = await this.proxy
    //     .send<any>({ cmd: MsPatterns.GET_USERS_BY_IDS }, { userIds })
    //     .toPromise();

    //   return res;
    // } catch (err) {
    //   this.logger.log(`Error: ${err}`);
    // }
    return [];
  }

  async saveUsers() {
    // try {
    //   return await this.proxy
    //     .send<any>({ cmd: MsPatterns.SAVE_USERS }, users)
    //     .toPromise();
    // } catch (err) {
    //   this.logger.log(`Error: ${err}`);
    // }
  }

  async setBankStore(gameId: string, player: IPlayer) {
    return await redis.set(gameId, JSON.stringify(player));
  }

  async getBankStore(gameId: string): Promise<IPlayer> {
    return JSON.parse(await redis.get(gameId));
  }

  async getPlayerById(gameId: string, userId: number): Promise<IPlayer> {
    const bank = await this.getBankStore(gameId);
    const players = await this.store.getPlayersStore(gameId);
    return userId === BOARD_PARAMS.BANK_PLAYER_ID
      ? bank
      : players.players.find((v) => v.userId === userId);
  }

  async getActingPlayer(gameId: string): Promise<IPlayer> {
    const state = await this.getBankStore(gameId);
    const user = Array.isArray(state) && state.find((v) => v.isActing);
    return user;
  }

  async getActingPlayerIndex(gameId: string): Promise<number> {
    const state = await this.getBankStore(gameId);
    const index = Array.isArray(state) && state.findIndex((v) => v.isActing);
    return index;
  }

  async getPlayerIndexById(gameId: string, userId: number) {
    const state = await this.getBankStore(gameId);
    return Array.isArray(state) && state.findIndex((v) => v.userId === userId);
  }

  async getPlayerMoneyById(gameId: string, userId: number): Promise<number> {
    const state = await this.getBankStore(gameId);
    const player =
      Array.isArray(state) && state.find((v) => v.userId === userId);
    return (player && player.money) || 0;
  }

  async unjailPlayer(gameId: string, newPosition?: number) {
    const player = await this.getActingPlayer(gameId);
    // After clicking unjail for money till show roll dices modal
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.DO_NOTHING,
      actionId: nanoid(4),
      moveId: 1,
      userId: player.userId,
    });

    return this.updatePlayer(gameId, {
      ...player,
      // if there is position then unjailed by rolling dices
      money: newPosition
        ? player.money
        : player.money - BOARD_PARAMS.UN_JAIL_PRICE,
      meanPosition: newPosition || BOARD_PARAMS.JAIL_POSITION,
      jailed: 0,
      unjailAttempts: 0,
    });
  }

  async jailPlayer(gameId: string): Promise<boolean> {
    const player = await this.getActingPlayer(gameId);
    return await this.updatePlayer(gameId, {
      ...player,
      jailed: BOARD_PARAMS.JAIL_TURNS,
      unjailAttempts: 0,
      doublesRolledAsCombo: 0,
      movesLeft: 0,
      meanPosition: BOARD_PARAMS.JAIL_POSITION,
    });
  }

  async updatePlayer(gameId: string, player: IPlayer): Promise<boolean> {
    // Update BANK
    if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
      return this.setBankStore(gameId, player) && true;
    }

    const playersState = await this.store.getPlayersStore(gameId);
    const currentPLayerIndex = await this.getPlayerIndexById(
      gameId,
      player.userId,
    );

    // TODO error handler
    if (currentPLayerIndex === -1)
      throw Error(`Not found player with id: ${player.userId}`);

    playersState.players[currentPLayerIndex] = player;

    return await this.updateAllPLayers(gameId, playersState.players);
  }

  async updateAllPLayers(gameId: string, players: IPlayer[]): Promise<boolean> {
    let state = await this.store.getPlayersStore(gameId);
    await this.store.setPlayersStore(gameId, {
      players,
      version: ++state.version,
    });
    return true;
  }
}
