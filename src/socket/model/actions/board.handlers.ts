import { ShowModal, BoardActionType } from '../types/board.types';
import nanoid from 'nanoid';

export const rollDicesHandler = (userId: number): ShowModal => {
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
