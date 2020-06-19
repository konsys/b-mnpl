import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
import {
  START_BONUS,
  START_PASSING_BONUS,
  BANK_PLAYER_ID,
} from './board.params';
import { nanoid } from 'nanoid';

export const getStartBonus = (toUserId: number, isStart = false) => {
  const transactionId = nanoid(4);
  const sum = isStart ? START_BONUS : START_PASSING_BONUS;
  setTransactionEvent({
    sum,
    userId: BANK_PLAYER_ID,
    reason: 'Стартовый бонус',
    transactionId,
    toUserId,
  });
  transactMoneyEvent(transactionId);
};
