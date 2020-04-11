import { ShowModal, BoardActionType } from 'src/types/board.types';
import { playersStore } from 'src/stores/players.store';
import nanoid from 'nanoid';
import { actionsStore } from 'src/stores/actions.store';

export const dicesModalHandler = (): ShowModal => {
  const state = playersStore.getState();
  const action = actionsStore.getState();
  let userId = state && state.find(v => v.isActing).userId;

  return {
    type: BoardActionType.SHOW_DICES_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: action.actionId,
  };
};

export const canBuyModal = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;
  return {
    type: BoardActionType.SHOW_DICES_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
