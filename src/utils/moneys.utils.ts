import { setTransaction, transactMoney } from 'src/stores/transactions.store';
import { BOARD_PARAMS } from '../params/board.params';
import { nanoid } from 'nanoid';

export const getStartBonus = async (toUserId: number, isStart = false) => {
  const transactionId = nanoid(4);
  const sum = isStart
    ? BOARD_PARAMS.START_BONUS
    : BOARD_PARAMS.START_PASSING_BONUS;
  await setTransaction('kkk', {
    sum,
    userId: BOARD_PARAMS.BANK_PLAYER_ID,
    reason: 'Стартовый бонус',
    transactionId,
    toUserId,
  });
  await transactMoney('kkk', transactionId);
};
