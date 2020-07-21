import { BOARD_PARAMS } from 'src/params/board.params';
import { ErrorCode } from 'src/utils/error.code';
import { IMoneyTransaction } from 'src/types/Board/board.types';
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

  async transactMoney(gameId: string, transactionId: string) {
    const transaction = await this.store.getTransaction(gameId);
    const player = await this.players.getPlayerById(gameId, transaction.userId);

    if (transaction.sum > player.money) {
      await this.store.setError('kkk', {
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
      await this.store.setError('kkk', {
        code: ErrorCode.WrongTranactionId,
        message: 'Oops!',
      });
    }
  }

  async moneyTransaction(
    gameId: string,
    transaction: IMoneyTransaction,
  ): Promise<boolean> {
    const player1 = await this.players.getPlayerById(
      gameId,
      transaction.userId,
    );
    const player2 = await this.players.getPlayerById(
      gameId,
      transaction.toUserId,
    );

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
