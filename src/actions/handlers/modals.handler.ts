import { ShowModal, BoardActionType } from 'src/types/board.types';
import { playersStore } from 'src/stores/players.store';
import nanoid from 'nanoid';
import { actionsStore } from 'src/stores/actions.store';
import { getActingUser } from 'src/utils/users';

export const dicesModalHandler = (): ShowModal => {
  const action = actionsStore.getState();
  const user = getActingUser();

  return {
    type: BoardActionType.SHOW_DICES_MODAL,
    userId: user.userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: action.actionId,
  };
};

export const canBuyModal = (): ShowModal => {
  const user = getActingUser();
  return {
    type: BoardActionType.SHOW_DICES_MODAL,
    userId: user.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
