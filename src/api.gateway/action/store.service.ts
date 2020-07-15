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

@Injectable()
export class StoreService {
  async setBoardStore(gameId: string, data: IBoardStore) {
    this.set(gameId, 'board', data);
  }

  async getBoardStore(gameId: string): Promise<IBoardStore> {
    return (await this.get(gameId, 'board')) as IBoardStore;
  }

  async setFieldsStore(gameId: string, data: IFieldsStore) {
    this.set(gameId, 'board', data);
  }

  async getFieldsStore(gameId: string): Promise<IFieldsStore> {
    return JSON.parse(await redis.get(`${gameId}-fields`)) as IFieldsStore;
  }

  private async set(gameId: string, serviceName: string, data: any) {
    await redis.set(`${gameId}-${serviceName}`, JSON.stringify(data));
  }

  private async get(gameId: string, serviceName: string): Promise<any> {
    return JSON.parse(await redis.get(`${gameId}-${serviceName}`));
  }
}
