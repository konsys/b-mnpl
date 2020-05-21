import { BoardMessage, IBoardEvent } from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { getBoughtFields } from 'src/utils/fields.utils';
import { BoardActionType } from 'src/types/board.types';
import {
  dicesModalHandler,
  buyModalHandler,
  payModalHandler,
  unJailModalHandler,
} from './client/modals.actions';
import { rollDicesHandler } from './client/dices.actions';

export const createBoardMessage = (): BoardMessage => {
  const actionState = actionsStore.getState();

  let event: IBoardEvent = {
    // Adapt from actionStore to send to client
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
        fields: getBoughtFields(),
      },
    },
  };
};

// Adaptsaction store action or message
const adaptAction = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.ROLL_DICES_MODAL:
      return dicesModalHandler();

    case BoardActionType.PLAYER_ROLL_DICES:
      return rollDicesHandler();

    case BoardActionType.CAN_BUY:
      return buyModalHandler();

    case BoardActionType.TAX_PAYING_MODAL:
      return payModalHandler();

    case BoardActionType.UN_JAIL_MODAL:
      return unJailModalHandler();
  }
};
