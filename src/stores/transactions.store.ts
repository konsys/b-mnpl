import { GameDomain } from 'src/stores/actions.store';
import { getPlayerById, updatePlayer } from 'src/utils/users.utils';
import { IMoneyTransaction } from 'src/types/board.types';
const TransactionsDomain = GameDomain.domain('PlayersDomain');

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  money: number;
  toUserId: number;
}

export const resetTransactionsEvent = TransactionsDomain.event();

export const transactMoneyEvent = TransactionsDomain.event<string>();

export const setTransactionEvent = TransactionsDomain.event<
  ITransactionStore
>();

export const transactionStore = TransactionsDomain.store<ITransactionStore | null>(
  null,
)
  .on(setTransactionEvent, (_, data) => data)
  .on(transactMoneyEvent, (prev, id) => {
    id === prev.transactionId &&
      moneyTransaction({
        sum: prev.money,
        userId: prev.userId,
        toUserId: prev.toUserId,
      });
    resetTransactionsEvent();
  })
  .reset(resetTransactionsEvent);

const moneyTransaction = (transaction: IMoneyTransaction): boolean => {
  const player1 = getPlayerById(transaction.userId);
  const player2 = transaction.toUserId
    ? getPlayerById(transaction.toUserId)
    : 0;

  // TODO error handler
  if (-player1.money > transaction.sum) throw Error('Not enough money');

  return (
    updatePlayer({ ...player1, money: player1.money + transaction.sum }) &&
    player2 &&
    updatePlayer({ ...player2, money: player2.money - transaction.sum })
  );
};
