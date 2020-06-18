import { GameDomain } from 'src/stores/actions.store';
import {
  getPlayerById,
  updatePlayer,
  getActingPlayer,
} from 'src/utils/users.utils';
import { IMoneyTransaction } from 'src/types/board.types';
import { ErrorCode } from 'src/utils/error.code';
import { setError } from './error.store';
import { BANK_PLAYER_ID } from 'src/utils/board.params';
import { bankStore } from './players.store';
const TransactionsDomain = GameDomain.domain('PlayersDomain');

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  money: number;
  toUserId: number;
}

export const getCurrentTransaction = () => transactionStore.getState();
export const resetTransactionsEvent = TransactionsDomain.event();

export const transactMoneyEvent = TransactionsDomain.event<string>();

export const setTransactionEvent = TransactionsDomain.event<
  ITransactionStore
>();

export const transactionStore = TransactionsDomain.store<ITransactionStore | null>(
  null,
)
  .on(setTransactionEvent, (_, data) => data)
  .on(transactMoneyEvent, (transaction, id) => {
    const player = getPlayerById(transaction.userId);
    if (transaction.money > player.money) {
      setError({
        code: ErrorCode.NotEnoughMoney,
        message: 'Oop!',
      });
      return;
    }

    if (id === transaction.transactionId) {
      moneyTransaction({
        sum: transaction.money,
        userId: transaction.userId,
        toUserId: transaction.toUserId,
      });
      resetTransactionsEvent();
    } else {
      setError({
        code: ErrorCode.WrongTranactionId,
        message: 'Oop!',
      });
    }
  })
  .reset(resetTransactionsEvent);

const moneyTransaction = (transaction: IMoneyTransaction): boolean => {
  const player1 = getPlayerById(transaction.userId);
  const player2 = getPlayerById(transaction.toUserId);

  return (
    updatePlayer({ ...player1, money: player1.money - transaction.sum }) &&
    updatePlayer({ ...player2, money: player2.money + transaction.sum })
  );
};

transactionStore.updates.watch((v) => console.log('transactionStore', v));
