import { Injectable } from '@nestjs/common';
import { redis } from 'src/main';
import { IField, IFieldAction } from 'src/types/Board/board.types';

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
  version: number;
  fields: IField[];
}

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  sum: number;
  toUserId: number;
}

@Injectable()
export class StoreService {
  async setBoardStore(gameId: string, data: IBoardStore) {
    this.set(gameId, 'board', data);
  }

  async getBoardStore(gameId: string): Promise<IBoardStore> {
    return (await this.get(gameId, 'board')) as IBoardStore;
  }

  async setFieldsStore(gameId: string, data: IFieldsStore) {
    this.set(gameId, 'fields', data);
  }

  async getFieldsStore(gameId: string): Promise<IFieldsStore> {
    return (await this.get(gameId, 'fields')) as IFieldsStore;
  }

  async setTransaction(gameId: string, data: ITransactionStore) {
    this.set(gameId, 'transaction', data);
  }

  async getTransaction(gameId: string): Promise<ITransactionStore> {
    return (await this.get(gameId, 'transaction')) as ITransactionStore;
  }

  async resetTransactionsEvent(gameId: string) {
    await this.set(gameId, 'transaction', null);
  }

  private async set(gameId: string, serviceName: string, data: any) {
    await redis.set(`${gameId}-${serviceName}`, JSON.stringify(data));
  }

  private async get(gameId: string, serviceName: string): Promise<any> {
    return JSON.parse(await redis.get(`${gameId}-${serviceName}`));
  }
}
