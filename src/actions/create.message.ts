import { BoardMessage, IBoardEvent } from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { adaptAction } from './handlers/action.adapter';
import { findBoughtFields } from 'src/utils/fields.utis.';

export const createBoardMessage = (): BoardMessage => {
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    // Adapt from actionStore
    action: actionState && adaptAction(actionState.action),
  };
  const players = playersStore.getState();
  return {
    code: 0,
    data: {
      id: actionState.moveId,
      event,
      boardStatus: {
        players: players.players,
        fields: findBoughtFields(),
      },
    },
  };
};
