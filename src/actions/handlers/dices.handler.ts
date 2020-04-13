import { BoardActionType, RollDices } from 'src/types/board.types';
import { random } from 'src/lib/utils';
import { dicesStore, setDicesEvent } from 'src/stores/dices.store';
import { IDicesStore } from 'src/stores/dices.store';
import { actionsStore } from 'src/stores/actions.store';
import { getActingPlayerIndex } from 'src/utils/users';
import { playersStore } from 'src/stores/players.store';

export const rollDicesHandler = (): RollDices => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  const action = actionsStore.getState();
  const playerIndex = getActingPlayerIndex();
  const allPlayers = playersStore.getState();
  const currentPlayer = allPlayers[playerIndex];
  const currenPosition = currentPlayer.status.meanPosition;

  if (!dicesState || dicesState._id !== action.actionId) {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    setDicesEvent({
      userId: currentPlayer.userId,
      dices: [dice1, dice2, dice3],
      _id: action.actionId,
      sum,
      meanPosition,
      isDouble: dice1 === dice2,
      isTriple: dice1 === dice2 && dice2 === dice3,
    });
    allPlayers;
    console.log(22222, allPlayers, currentPlayer);
  }

  return {
    type: BoardActionType.ROLL_DICES,
    userId: currentPlayer.userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
  };
};
