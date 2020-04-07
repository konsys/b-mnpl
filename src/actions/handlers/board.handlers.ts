import { ShowModal, BoardActionType, RollDices } from 'src/types/board.types';
import nanoid from 'nanoid';
import { playersStore } from 'src/stores/players.store';
import { random } from 'src/lib/utils';

export const dicesModalHandler = (): ShowModal => {
  let userId = 0;
  playersStore.watch(v => {
    userId = v && v.find(v => v.isActing === true)?.userId;
  });

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};

export const rollDicesHandler = (): RollDices => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const sum = dice1 + dice2 + dice3;

  let userId = 0;
  let currenPosition = 0;
  playersStore.watch(v => {
    const actingPlayer = v && v.find(v => v.isActing === true);
    userId = actingPlayer?.userId;
    currenPosition = actingPlayer?.status.meanPosition;
  });
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
  let userId = 0;
  playersStore.watch(v => {
    userId = v && v.find(v => v.isActing === true)?.userId;
  });
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
