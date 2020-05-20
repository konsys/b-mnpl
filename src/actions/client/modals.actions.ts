import {
  DicesModal,
  BoardActionType,
  CanBuyModal,
  PayRentStart,
  UnJailModal,
} from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users.utils';
import { actionsStore } from 'src/stores/actions.store';
import { findFieldByPosition } from 'src/utils/fields.utils';

/**
 * Shows modals
 */
export const dicesModalHandler = (): DicesModal => ({
  type: BoardActionType.ROLL_DICES_MODAL,
  userId: getActingPlayer().userId,
  title: 'Кидайте кубики',
  text: 'Мы болеем за вас',
  _id: actionsStore.getState().actionId,
});

export const unJailModalHandler = (): UnJailModal => ({
  type: BoardActionType.UN_JAIL_MODAL,
  userId: getActingPlayer().userId,
  title: 'Выйти из тюрьмы',
  text: 'Можете выйти, заплатив залог или кинуть кубики на удачу',
  _id: actionsStore.getState().actionId,
});

export const buyModalHandler = (): CanBuyModal => {
  const user = getActingPlayer();

  return {
    type: BoardActionType.CAN_BUY,
    userId: user.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    field: findFieldByPosition(user.meanPosition),
    money: user.money,
    _id: actionsStore.getState().actionId,
  };
};

export const payModalHandler = (): PayRentStart => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);

  const action = actionsStore.getState();
  return {
    type: BoardActionType.TAX_PAYING_MODAL,
    userId: user.userId,
    title: 'Заплатить',
    text: `Вы должны заплатить ${field.price}k`,
    field: field,
    money: user.money,

    // TODO доделать платеж игроку
    toUserId: 0,
    _id: action.actionId,
  };
};
