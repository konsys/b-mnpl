import { BoardMessage, IBoardEvent } from '../types/board.types';
import { dicesModalHandler } from './handlers/board.handlers';
import { playersStore } from 'src/stores/players.store';
import { moveStore } from 'src/stores/move.store';

export const boardMessage = (): BoardMessage => {
  const moveState = moveStore.getState();

  let event: IBoardEvent = { action: dicesModalHandler() };

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
