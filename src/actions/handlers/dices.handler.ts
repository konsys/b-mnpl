import { BoardActionType, RollDices } from 'src/types/board.types';
import { dicesStore, setRandomDicesEvent } from 'src/stores/dices.store';
import { IDicesStore } from 'src/stores/dices.store';
import { actionsStore } from 'src/stores/actions.store';
import { getActingPlayer } from 'src/utils/users.utils';
export const rollDicesHandler = (): RollDices => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  const action = actionsStore.getState();
  if (!dicesState || dicesState._id !== action.actionId) {
    setRandomDicesEvent(action.actionId);
  }
  const player = getActingPlayer();
  return {
    type: BoardActionType.ROLL_DICES,
    userId: player.userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
  };
};
