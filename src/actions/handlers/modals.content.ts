import { ShowModal, BoardActionType } from 'src/types/board.types';
import { playersStore } from 'src/stores/players.store';
import { setCurrentActionsEvent } from 'src/stores/actions.store';
import nanoid from 'nanoid';

export const dicesModalHandler = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;

  setCurrentActionsEvent({
    action: BoardActionType.SHOW_MODAL,
    userId,
    srcOfChange: 'rollDicesHandler',
  });

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};
