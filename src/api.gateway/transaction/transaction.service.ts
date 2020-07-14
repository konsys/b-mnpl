import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/utils/error.code';
import { redis } from 'src/main';
import { setError } from 'src/stores/error.store';
import { UsersService } from '../users/users.service';
import { IMoneyTransaction } from 'src/types/Board/board.types';

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  sum: number;
  toUserId: number;
}

@Injectable()
export class TransactionService {
  constructor(private readonly usersService: UsersService) {}

  async setTransaction(gameId: string, t: ITransactionStore) {
    return await redis.set(`${gameId}-transaction`, JSON.stringify(t));
  }

  async getTransaction(gameId: string): Promise<ITransactionStore> {
    return JSON.parse(
      await redis.get(`${gameId}-transaction`),
    ) as ITransactionStore;
  }

  async getCurrentTransaction(gameId: string) {
    return await this.getTransaction(gameId);
  }

  async resetTransactionsEvent(gameId: string) {
    await this.setTransaction(gameId, null);
  }

  async transactMoney(gameId: string, transactionId: string) {
    const transaction = await this.getTransaction(gameId);
    const player = await this.usersService.getPlayerById(
      gameId,
      transaction.userId,
    );
    if (transaction.sum > player.money) {
      setError({
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
      return;
    }

    if (transactionId === transaction.transactionId) {
      await this.moneyTransaction(gameId, {
        sum: transaction.sum,
        userId: transaction.userId,
        toUserId: transaction.toUserId,
      });
      await this.resetTransactionsEvent(gameId);
    } else {
      setError({
        code: ErrorCode.WrongTranactionId,
        message: 'Oops!',
      });
    }
  }

  async moneyTransaction(
    gameId: string,
    transaction: IMoneyTransaction,
  ): Promise<boolean> {
    const player1 = await this.usersService.getPlayerById(
      gameId,
      transaction.userId,
    );
    const player2 = await this.usersService.getPlayerById(
      gameId,
      transaction.toUserId,
    );

    return (
      (await this.usersService.updatePlayer(gameId, {
        ...player1,
        money: player1.money - transaction.sum,
      })) &&
      (await this.usersService.updatePlayer(gameId, {
        ...player2,
        money: player2.money + transaction.sum,
      }))
    );
  }
}
