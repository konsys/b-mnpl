import {
  BoardMessage,
  IBoardEvent,
  IncomeMessageType,
  OutcomeMessageType,
} from '../types/board.types';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { getBoughtFields } from 'src/utils/fields.utils';
import {
  rollDicesModalMessage,
  buyModalHandler,
  payModalHandler,
  unJailModalMesage,
} from './client/modals.actions';
import { rollDicesMessage } from './client/dices.actions';

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

// When emit message action is sent from action store
const adaptAction = (type: OutcomeMessageType | IncomeMessageType) => {
  console.log('typetypetype', type);
  switch (type) {
    case OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL:
      return rollDicesModalMessage();

    case OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION:
      return rollDicesMessage();

    case OutcomeMessageType.OUTCOME_CAN_BUY_MODAL:
      return buyModalHandler();

    case OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL:
      return payModalHandler();

    case OutcomeMessageType.OUTCOME_UN_JAIL_MODAL:
      return unJailModalMesage();
  }
};
