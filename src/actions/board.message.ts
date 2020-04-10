import {
  BoardMessage,
  IBoardEvent,
  BoardActionType,
} from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { moveStore } from 'src/stores/move.store';
import { mainActionHandler } from './handlers/main.action.handler';

export const boardMessage = (): BoardMessage => {
  const moveState = moveStore.getState();

  let event: IBoardEvent = {
    action: mainActionHandler(BoardActionType.ROLL_DICES),
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
