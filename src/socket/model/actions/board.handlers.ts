import { ShowModal, BoardActionType } from '../types/board.types';
import nanoid from 'nanoid';
import { setCurrentActionEvent, boardActionsStore } from './board.action.store';
import { IGameModel } from '../types/game.types';

export const rollDicesHandler = (payload: IGameModel): ShowModal => {
  let userId = 0;
  boardActionsStore.watch(v => {
    userId = v.userId;
  });

  setCurrentActionEvent({
    userId,
    action: BoardActionType.SHOW_MODAL,
  });
  console.log(23423424, userId);
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
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
