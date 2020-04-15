import { BoardMessage, IBoardEvent } from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { adaptAction } from './handlers/action.adapter';

export const createBoardMessage = (): BoardMessage => {
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    // Adapt from actionStore
    action: actionState && adaptAction(actionState.action),
  };
  let players = playersStore.getState();
  return {
    code: 0,
    data: {
      id: actionState.moveId,
      event,
      boardStatus: {
        players,
      },
    },
  };
};
