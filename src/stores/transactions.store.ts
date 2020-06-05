import { GameDomain } from 'src/stores/actions.store';
import { moneyTransaction } from 'src/utils/users.utils';

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
