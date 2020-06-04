import {
  BoardMessage,
  IBoardEvent,
  IncomeMessageType,
  OutcomeMessageType,
} from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { getBoughtFields } from 'src/utils/fields.utils';
import { actionTypeToEventAdapter } from './outcome.messages';

export const createBoardMessage = (): BoardMessage => {
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    // Adapt from actionStore to send to client
    action: actionState && actionTypeToEventAdapter(actionState.action),
  };
  const players = playersStore.getState();
  return {
    code: 0,
    data: {
      id: actionState.moveId,
      event,
      boardStatus: {
        players: players.players,
        fields: getBoughtFields(),
      },
    },
  };
};
