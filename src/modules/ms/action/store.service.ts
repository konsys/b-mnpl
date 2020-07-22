import {
  BoardMessage,
  IField,
  IFieldAction,
  IPlayer,
} from 'src/types/board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { ICurrentAction } from './action.service';
import { IPlayersStore } from '../../../api.gateway/users/users.service';
import { Injectable } from '@nestjs/common';
import { redis } from 'src/main';

export interface IPlayerAction {
  userId: number;
  fieldId: number;
  fieldGroup: number;
  fieldAction: IFieldAction;
}

export interface IBoardStore {
  isNewRound: boolean;
  gameRound: number;
  playersTurn: number;
  playerActions: IPlayerAction[];
}

export interface IFieldsStore {
  fields: IField[];
}

export interface IAuctionStore {
  bet: number;
  field: BoardFieldsEntity;
  userId: number;
  participants: number[];
  isEnded: boolean;
}

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  sum: number;
  toUserId: number;
}

export interface IDicesStore {
  userId: number;
  _id: string;
  dices: number[];
  sum: number;
  meanPosition: number;
  isDouble: boolean;
  isTriple: boolean;
}

export interface IStore {
  bank: string;
  dices: string;
  action: string;
  board: string;
  fields: string;
  transaction: string;
  players: string;
  auction: string;
  error: string;
  message: string;
}

const storeNames: IStore = {
  bank: 'bank',
  dices: 'dices',
  action: 'action',
  board: 'board',
  fields: 'fields',
  transaction: 'transaction',
  players: 'players',
  auction: 'auction',
  error: 'error',
  message: 'message',
};

export interface IErrorMessage {
  code: number;
  message: string;
}

export const ERROR_CHANEL = `${storeNames.error}`;
// Redis Commands https://github.com/NodeRedis/node-redis/tree/master/test/commands
@Injectable()
export class StoreService {
  async flushGame(gameId: string) {
    for (const k of Object.values(storeNames)) {
      await redis.del(`${gameId}-${k}`);
    }
  }

  async setBankStore(gameId: string, data: IPlayer) {
    await this.set(gameId, storeNames.bank, data);
  }

  async getBankStore(gameId: string): Promise<IPlayer> {
    return (await this.get(gameId, storeNames.bank)) as IPlayer;
  }

  async setDicesStore(gameId: string, data: IDicesStore) {
    await this.set(gameId, storeNames.dices, data);
  }

  async getDicesStore(gameId: string): Promise<IDicesStore> {
    return (await this.get(gameId, storeNames.dices)) as IDicesStore;
  }

  async setActionStore(gameId: string, data: ICurrentAction) {
    await this.set(gameId, storeNames.action, data);
  }

  async getActionStore(gameId: string): Promise<ICurrentAction> {
    return (await this.get(gameId, storeNames.action)) as ICurrentAction;
  }

  async setBoardStore(gameId: string, data: IBoardStore) {
    await this.set(gameId, storeNames.board, data);
  }

  async getBoardStore(gameId: string): Promise<IBoardStore> {
    return (await this.get(gameId, storeNames.board)) as IBoardStore;
  }

  async setFieldsStore(gameId: string, data: IFieldsStore) {
    await this.set(gameId, storeNames.fields, data);
  }

  async getFieldsStore(gameId: string): Promise<IFieldsStore> {
    return (await this.get(gameId, storeNames.fields)) as IFieldsStore;
  }

  async setTransaction(gameId: string, data: ITransactionStore) {
    await this.set(gameId, storeNames.transaction, data);
  }

  async getTransaction(gameId: string): Promise<ITransactionStore> {
    return (await this.get(
      gameId,
      storeNames.transaction,
    )) as ITransactionStore;
  }

  async resetTransactionsEvent(gameId: string) {
    await redis.del(`${gameId}-${storeNames.transaction}`);
  }

  async setPlayersStore(gameId: string, data: IPlayersStore) {
    await this.set(gameId, storeNames.players, data);
  }

  async getPlayersStore(gameId: string): Promise<IPlayersStore> {
    return (await this.get(gameId, storeNames.players)) as IPlayersStore;
  }

  async setAuctionStore(gameId: string, data: IAuctionStore) {
    await this.set(gameId, storeNames.auction, data);
  }

  async getAuctionStore(gameId: string): Promise<IAuctionStore> {
    return (await this.get(gameId, storeNames.auction)) as IAuctionStore;
  }

  async flushAuctionStore(gameId: string) {
    return await redis.del(`${gameId}-${storeNames.auction}`);
  }

  async setError(gameId: string, data: IErrorMessage) {
    await redis.publish(`${gameId}-${storeNames.error}`, JSON.stringify(data));
    await this.set(gameId, storeNames.error, data);
  }

  async getError(gameId: string): Promise<IErrorMessage> {
    return (await this.get(gameId, storeNames.error)) as IErrorMessage;
  }

  async sendMessage(gameId: string, data: BoardMessage) {
    await redis.publish(
      `${gameId}-${storeNames.message}`,
      JSON.stringify(data),
    );
    await this.set(gameId, storeNames.message, data);
  }

  async resetError(gameId: string) {
    const pipeline = redis.pipeline();
    await pipeline.del(`${gameId}-${storeNames.error}`);
  }

  private async set(gameId: string, serviceName: string, data: any) {
    await redis.set(`${gameId}-${serviceName}`, JSON.stringify(data));

    await redis.expire([`${gameId}-${serviceName}`, BOARD_PARAMS.REDIS_TTL]);
  }

  private async get(gameId: string, serviceName: string): Promise<any> {
    return JSON.parse(await redis.get(`${gameId}-${serviceName}`));
  }
}