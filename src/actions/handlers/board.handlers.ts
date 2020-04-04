import { ShowModal, BoardActionType, RollDices } from 'src/types/board.types';
import nanoid from 'nanoid';
import { IGameModel } from 'src/types/game.types';
import { playersStore } from 'src/stores/players.store';

export const dicesModalHandler = (payload: IGameModel): ShowModal => {
  let userId = 0;
  playersStore.watch(v => {
    userId = v.find(v => v.isActing === true)?.userId;
  });

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};

export const rollDicesHandler = (payload: IGameModel): RollDices => {
  let userId = 0;
  playersStore.watch(v => {
    userId = v.find(v => v.isActing === true)?.userId;
  });

  return {
    type: BoardActionType.ROLL_DICES,
    userId,
    dices: [1, 1, 1],
    meanPosition: 9,
    _id: nanoid(4),
  };
};

export const canBuyModal = (userId: number): ShowModal => {
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
