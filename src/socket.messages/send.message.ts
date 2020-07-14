import { BoardMessage, IBoardEvent } from '../types/Board/board.types';
import { actionsStore } from 'src/stores/actions.store';
import { getBoughtFields } from 'src/utils/fields.utils';
import { actionTypeToEventAdapter } from './outcome.messages';
import { getPlayersStore } from 'src/stores/players.store';

export const createBoardMessage = async (): Promise<BoardMessage> => {
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    // Adapt from actionStore to send to client
    action: actionState && actionTypeToEventAdapter(actionState.action),
  };
  const players = await getPlayersStore('kkk');

  return {
    code: 0,
    data: {
      id: (actionState && actionState.moveId) || 0,
      event,
      boardStatus: {
        players: players.players,
        fields: getBoughtFields(),
      },
    },
  };
};
