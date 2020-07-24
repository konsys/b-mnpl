import { BOARD_PARAMS } from 'src/params/board.params';
import { ErrorCode } from 'src/utils/error.code';
import { IMoneyTransaction } from 'src/types/board/board.types';
import { Injectable } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { nanoid } from 'nanoid';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly players: PlayersUtilsService,
    private readonly store: StoreService,
  ) {}

  async getCurrentTransaction(gameId: string) {
    return await this.store.getTransaction(gameId);
  }

  async transactMoney(userId: number, transactionId: string) {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    const transaction = await this.store.getTransaction(gameId);
    const player = await this.players.getPlayer(userId);

    if (transaction.sum > player.money) {
      await this.store.setError(userId, {
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
      return;
    }

    if (transactionId === transaction.transactionId) {
      await this.moneyTransaction(userId, {
        sum: transaction.sum,
        userId: transaction.userId,
        toUserId: transaction.toUserId,
      });
      await this.store.resetTransactionsEvent(gameId);
    } else {
      await this.store.setError(userId, {
        code: ErrorCode.WrongTranactionId,
        message: 'Oops!',
      });
    }
  }

  async moneyTransaction(
    userId: number,
    transaction: IMoneyTransaction,
  ): Promise<boolean> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    const player1 = await this.players.getPlayer(transaction.userId);
    const player2 = await this.players.getPlayer(transaction.toUserId);

    return (
      (await this.players.updatePlayer(
        gameId,
        {
          ...player1,
          money: player1.money - transaction.sum,
        },
        'transaction',
      )) &&
      (await this.players.updatePlayer(
        gameId,
        {
          ...player2,
          money: player2.money + transaction.sum,
        },
        'transaction2' + transaction.sum,
      ))
    );
  }

  async getStartBonus(userId: number, isStart = false) {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    const transactionId = nanoid(4);
    const sum = isStart
      ? BOARD_PARAMS.START_BONUS
      : BOARD_PARAMS.START_PASSING_BONUS;
    await this.store.setTransaction(gameId, {
      sum,
      userId: BOARD_PARAMS.BANK_PLAYER_ID,
      reason: 'Стартовый бонус',
      transactionId,
      toUserId: userId,
    });
    await this.transactMoney(userId, transactionId);
  }
}
