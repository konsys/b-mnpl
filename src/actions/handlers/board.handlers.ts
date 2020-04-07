import { ShowModal, BoardActionType, RollDices } from 'src/types/board.types';
import nanoid from 'nanoid';
import { playersStore } from 'src/stores/players.store';
import { random } from 'src/lib/utils';
import { dicesStore } from 'src/stores/dices.store';

export const dicesModalHandler = (): ShowModal => {
  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};

export const rollDicesHandler = (): RollDices => {
  dicesStore.getState();

  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;

  const state = playersStore.getState();
  let userId = state && state.find(v => v.isActing).userId;
  let currenPosition =
    state && state.find(v => v.isActing).status?.meanPosition;

  const sum = dice1 + dice2 + dice3 + currenPosition;
  const meanPosition = sum < 40 ? sum : sum - 40;
  return {
    type: BoardActionType.ROLL_DICES,
    userId,
    dices: [dice1, dice2, dice3],
    meanPosition,
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
