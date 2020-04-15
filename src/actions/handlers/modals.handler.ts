import { ShowModal, BoardActionType } from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users';
import { actionsStore } from 'src/stores/actions.store';

export const dicesModalHandler = (): ShowModal => {
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

export const buyModalHandler = (): ShowModal => {
  const user = getActingPlayer();
  const action = actionsStore.getState();
  return {
    type: BoardActionType.SHOW_DICES_MODAL,
    userId: user.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: action.actionId,
  };
};
