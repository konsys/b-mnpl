import {
  DicesModal,
  BoardActionType,
  CanBuyModal,
} from 'src/types/board.types';
import { getActingPlayer, getField } from 'src/utils/users';
import { actionsStore } from 'src/stores/actions.store';
import { fieldsStore } from 'src/stores/fields.store';

export const dicesModalHandler = (): DicesModal => {
  const user = getActingPlayer();
  const action = actionsStore.getState();
  return {
    type: BoardActionType.SHOW_DICES_MODAL,
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
    field: getField(user.meanPosition),
    money: user.money,
    _id: action.actionId,
  };
};
