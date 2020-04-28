import { BoardActionType, RollDices } from 'src/types/board.types';
import { random } from 'src/lib/utils';
import { dicesStore, setDicesEvent } from 'src/stores/dices.store';
import { IDicesStore } from 'src/stores/dices.store';
import { actionsStore } from 'src/stores/actions.store';
import {
  getActingPlayer,
  getActingPlayerIndex,
  updateAllPLayers,
} from 'src/utils/users.utils';
import { playersStore } from 'src/stores/players.store';

export const rollDicesHandler = (): RollDices => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  const action = actionsStore.getState();
  const player = getActingPlayer();

  const currenPosition = player.meanPosition;

  if (!dicesState || dicesState._id !== action.actionId) {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    setDicesEvent({
      userId: player.userId,
      dices: [dice1, dice2, dice3],
      _id: action.actionId,
      sum,
      meanPosition,
      isDouble: dice1 === dice2,
      isTriple: dice1 === dice2 && dice2 === dice3,
    });
    const players = playersStore.getState();

    /**
     * Set Position to player store
     */
    const actIndex = getActingPlayerIndex();
    players[actIndex].prevPosition = players[actIndex].meanPosition;
    players[actIndex].meanPosition = meanPosition;
    updateAllPLayers(players);
  }

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
