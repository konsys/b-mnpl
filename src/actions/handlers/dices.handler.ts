import { BoardActionType, RollDices } from 'src/types/board.types';
import nanoid from 'nanoid';
import { playersStore } from 'src/stores/players.store';
import { random } from 'src/lib/utils';
import { dicesStore, setDicesEvent } from 'src/stores/dices.store';
import { IDicesStore } from 'src/stores/dices.store';
import { actionsStore } from 'src/stores/actions.store';

export const rollDicesHandler = (): RollDices => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  const action = actionsStore.getState();
  const user = playersStore.getState();
  const userId = user && user.find(v => v.isActing).userId;

  const currenPosition =
    user && user.find(v => v.isActing).status?.meanPosition;

  if (!dicesState || dicesState._id !== action.actionId) {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    setDicesEvent({
      userId,
      dices: [dice1, dice2, dice3],
      _id: action.actionId,
      sum,
      meanPosition,
      isDouble: dice1 === dice2,
      isTriple: dice1 === dice2 && dice2 === dice3,
    });
  }

  return {
    type: BoardActionType.ROLL_DICES,
    userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: nanoid(4),
  };
};
