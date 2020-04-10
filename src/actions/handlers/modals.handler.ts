import { ShowModal, BoardActionType } from 'src/types/board.types';
import { playersStore } from 'src/stores/players.store';
import nanoid from 'nanoid';

export const dicesModalHandler = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};

export const canBuyModal = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
