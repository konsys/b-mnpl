import { GameDomain } from 'src/stores/actions.store';
import { getPlayerById, updatePlayer } from 'src/utils/users.utils';
import { IMoneyTransaction } from 'src/types/Board/board.types';
import { ErrorCode } from 'src/utils/error.code';
import { setError } from './error.store';
import { redis } from 'src/main';
const TransactionsDomain = GameDomain.domain('PlayersDomain');

export interface ITransactionStore {
  transactionId: string;
  reason: string;
  userId: number;
  sum: number;
  toUserId: number;
}

export const setTransaction = async (gameId: string, t: ITransactionStore) =>
  await redis.set(`${gameId}-transaction`, JSON.stringify(t));

export const getTransaction = async (
  gameId: string,
): Promise<ITransactionStore> =>
  JSON.parse(await redis.get(`${gameId}-transaction`)) as ITransactionStore;

export const getCurrentTransaction = async (gameId: string) =>
  getTransaction(gameId);

export const resetTransactionsEvent = (gameId: string) =>
  setTransaction(gameId, null);

export const transactMoneyEvent = async (
  gameId: string,
  transaction: ITransactionStore,
  id: string,
) => {
  const player = await getPlayerById('kkk', transaction.userId);
  if (transaction.sum > player.money) {
    setError({
      code: ErrorCode.NotEnoughMoney,
      message: 'Oops!',
    });
    return;
  }

  if (id === transaction.transactionId) {
    moneyTransaction({
      sum: transaction.sum,
      userId: transaction.userId,
      toUserId: transaction.toUserId,
    });
    resetTransactionsEvent(gameId);
  } else {
    setError({
      code: ErrorCode.WrongTranactionId,
      message: 'Oops!',
    });
  }
};

export const setTransactionEvent = TransactionsDomain.event<
  ITransactionStore
>();

const moneyTransaction = async (
  transaction: IMoneyTransaction,
): Promise<boolean> => {
  const player1 = await getPlayerById('kkk', transaction.userId);
  const player2 = await getPlayerById('kkk', transaction.toUserId);

  return (
    updatePlayer('kkk', {
      ...player1,
      money: player1.money - transaction.sum,
    }) &&
    updatePlayer('kkk', { ...player2, money: player2.money + transaction.sum })
  );
};

// transactionStore.updates.watch((v) => console.log('transactionStore', v));
