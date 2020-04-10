import { BoardMessage, IBoardEvent } from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { moveStore } from 'src/stores/move.store';
import { actionsStore } from 'src/stores/actions.store';
import { adaptAction } from './handlers/main.action.handler';

export const boardMessage = (): BoardMessage => {
  const moveState = moveStore.getState();
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    action: actionState && adaptAction(actionState.action),
  };

  let players = [];
  playersStore.watch(v => {
    players = v;
  });
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
