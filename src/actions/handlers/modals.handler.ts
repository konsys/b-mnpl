import {
  DicesModal,
  BoardActionType,
  CanBuyModal,
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
