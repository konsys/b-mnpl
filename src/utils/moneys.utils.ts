import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
import { START_BONUS } from './board.params';
import { whosField } from './fields.utils';
import nanoid from 'nanoid';
import { getActingPlayer } from './users.utils';

export const getStartBonus = () => {
  const id = nanoid(4);
  setTransactionEvent({
    money: START_BONUS,
    userId: getActingPlayer().userId,
    toUserId: whosField(),
    reason: 'Стартовый бонус',
    transactionId: id,
  });
  transactMoneyEvent(id);
};
