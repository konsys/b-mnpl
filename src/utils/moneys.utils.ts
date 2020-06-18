import {
  setTransactionEvent,
  transactMoneyEvent,
  transactionStore,
} from 'src/stores/transactions.store';
import { START_BONUS, START_PASSING_BONUS } from './board.params';
import { whosField } from './fields.utils';
import { nanoid } from 'nanoid';
import { getActingPlayer } from './users.utils';

export const getStartBonus = (isStart = false) => {
  const id = nanoid(4);

  setTransactionEvent({
    money: isStart ? START_BONUS : START_PASSING_BONUS,
    userId: getActingPlayer().userId,
    toUserId: whosField(),
    reason: 'Стартовый бонус',
    transactionId: id,
  });
  // console.log(123123123, transactionStore.getState());
  transactMoneyEvent(id);
};
