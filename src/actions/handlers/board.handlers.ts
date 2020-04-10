import { ShowModal, BoardActionType, RollDices } from 'src/types/board.types';
import nanoid from 'nanoid';
import { playersStore } from 'src/stores/players.store';
import { random } from 'src/lib/utils';
import { dicesStore, setDicesEvent } from 'src/stores/dices.store';
import { moveStore } from 'src/stores/move.store';
import { IDicesStore } from 'src/stores/dices.store';

export const rollDicesHandler = (): RollDices => {
  const dices: IDicesStore = dicesStore.getState();
  const move = moveStore.getState();
  const user = playersStore.getState();
  const userId = user && user.find(v => v.isActing).userId;

  const currenPosition =
    user && user.find(v => v.isActing).status?.meanPosition;

  if (!dices || dices.moveId !== move.moveId) {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    setDicesEvent({
      userId,
      moveId: move.moveId,
      dices: [dice1, dice2, dice3],
      sum,
      meanPosition,
      isDouble: dice1 === dice2,
      isTriple: dice1 === dice2 && dice2 === dice3,
    });
  }

  return {
    type: BoardActionType.ROLL_DICES,
    userId,
    dices: dices.dices,
    meanPosition: dices.sum,
    isDouble: dices.isDouble,
    isTriple: dices.isTriple,
    _id: nanoid(4),
  };
};

export const canBuyModal = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
