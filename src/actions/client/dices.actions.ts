import { OutcomeMessageType, IRollDicesMessage } from 'src/types/board.types';
import { dicesStore, setRandomDicesEvent } from 'src/stores/dices.store';
import { IDicesStore } from 'src/stores/dices.store';
import { actionsStore } from 'src/stores/actions.store';
import { getActingPlayer } from 'src/utils/users.utils';

export const rollDicesMessage = (): IRollDicesMessage => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  // Send message to roll dices and waits for css transition is complete
  const action = actionsStore.getState();
  if (!dicesState || dicesState._id !== action.actionId) {
    setRandomDicesEvent(action.actionId);
  }
  return {
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
  };
};
