import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/utils/error.code';
import { setError } from 'src/stores/error.store';
import { UsersService } from '../users/users.service';
import { IMoneyTransaction } from 'src/types/Board/board.types';
import { StoreService } from './store.service';
import { nanoid } from 'nanoid';
import { BOARD_PARAMS } from 'src/params/board.params';

@Injectable()
export class TransactionService {
  constructor(
    private readonly usersService: UsersService,
    private readonly store: StoreService,
  ) {}

  async getCurrentTransaction(gameId: string) {
    return await this.store.getTransaction(gameId);
  }

  async transactMoney(gameId: string, transactionId: string) {
    const transaction = await this.store.getTransaction(gameId);
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
      await this.store.resetTransactionsEvent(gameId);
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

  async getStartBonus(gameId: string, toUserId: number, isStart = false) {
    const transactionId = nanoid(4);
    const sum = isStart
      ? BOARD_PARAMS.START_BONUS
      : BOARD_PARAMS.START_PASSING_BONUS;
    await this.store.setTransaction(gameId, {
      sum,
      userId: BOARD_PARAMS.BANK_PLAYER_ID,
      reason: 'Стартовый бонус',
      transactionId,
      toUserId,
    });
    await this.transactMoney(gameId, transactionId);
  }
}
