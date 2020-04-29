import {
  DicesModal,
  BoardActionType,
  CanBuyModal,
  PayRentStart,
} from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users.utils';
import { actionsStore } from 'src/stores/actions.store';
import { findFieldByPosition } from 'src/utils/fields.utis.';

export const dicesModalHandler = (): DicesModal => {
  const user = getActingPlayer();
  const action = actionsStore.getState();
  return {
    type: BoardActionType.ROLL_DICES_MODAL,
    userId: user.userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: action.actionId,
  };
};

export const buyModalHandler = (): CanBuyModal => {
  const user = getActingPlayer();

  const action = actionsStore.getState();
  return {
    type: BoardActionType.CAN_BUY,
    userId: user.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    field: findFieldByPosition(user.meanPosition),
    money: user.money,
    _id: action.actionId,
  };
};

export const payModalHandler = (): PayRentStart => {
  const user = getActingPlayer();

  const action = actionsStore.getState();
  return {
    type: BoardActionType.PAY_RENT_START,
    userId: user.userId,
    title: 'Заплатить',
    text: 'Вы долюны заплатить по счетам',
    field: findFieldByPosition(user.meanPosition),
    money: user.money,

    // TODO доделать платеж игроку
    toUserId: 0,
    _id: action.actionId,
  };
};
