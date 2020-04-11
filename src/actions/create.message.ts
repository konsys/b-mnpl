import { HandleMessage, IBoardEvent } from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { moveStore } from 'src/stores/move.store';
import { actionsStore } from 'src/stores/actions.store';
import { adaptAction } from './handlers/action.adapter';

export const createBoardMessage = (): HandleMessage => {
  const moveState = moveStore.getState();
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    action: actionState && adaptAction(actionState.action),
  };

  console.log(111, event);
  let players = playersStore.getState();
  return {
    code: 0,
    data: {
      id: moveState.moveId,
      event,
      boardStatus: {
        players,
      },
    },
  };
};
