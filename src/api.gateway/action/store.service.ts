import { IField, IFieldAction, IPlayer } from 'src/types/Board/board.types';

import { ICurrentAction } from './action.service';
import { IPlayersStore } from '../users/users.service';
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

@Injectable()
export class StoreService {
  async setBankStore(gameId: string, data: IPlayer) {
    await this.set(gameId, 'dices', data);
  }

  async getBankStore(gameId: string): Promise<IPlayer> {
    return (await this.get(gameId, 'dices')) as IPlayer;
  }

  async setDicesStore(gameId: string, data: IDicesStore) {
    await this.set(gameId, 'dices', data);
  }

  async getDicesStore(gameId: string): Promise<IDicesStore> {
    return (await this.get(gameId, 'dices')) as IDicesStore;
  }

  async setActionStore(gameId: string, data: ICurrentAction) {
    await this.set(gameId, 'action', data);
  }

  async getActionStore(gameId: string): Promise<ICurrentAction> {
    return (await this.get(gameId, 'action')) as ICurrentAction;
  }

  async setBoardStore(gameId: string, data: IBoardStore) {
    await this.set(gameId, 'board', data);
  }

  async getBoardStore(gameId: string): Promise<IBoardStore> {
    return (await this.get(gameId, 'board')) as IBoardStore;
  }

  async setFieldsStore(gameId: string, data: IFieldsStore) {
    await this.set(gameId, 'fields', data);
  }

  async getFieldsStore(gameId: string): Promise<IFieldsStore> {
    return (await this.get(gameId, 'fields')) as IFieldsStore;
  }

  async setTransaction(gameId: string, data: ITransactionStore) {
    await this.set(gameId, 'transaction', data);
  }

  async getTransaction(gameId: string): Promise<ITransactionStore> {
    return (await this.get(gameId, 'transaction')) as ITransactionStore;
  }

  async resetTransactionsEvent(gameId: string) {
    await this.set(gameId, 'transaction', null);
  }

  async setPlayersStore(gameId: string, data: IPlayersStore) {
    await this.set(gameId, 'players', data);
  }

  async getPlayersStore(gameId: string): Promise<IPlayersStore> {
    return (await this.get(gameId, 'players')) as IPlayersStore;
  }

  private async set(gameId: string, serviceName: string, data: any) {
    await redis.set(`${gameId}-${serviceName}`, JSON.stringify(data));
  }

  private async get(gameId: string, serviceName: string): Promise<any> {
    return JSON.parse(await redis.get(`${gameId}-${serviceName}`));
  }
}
