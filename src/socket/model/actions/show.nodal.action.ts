import { BoardActionType, ShowModal } from '../types/board.types';
import nanoid from 'nanoid';

export const rollDicesModal = (userId: number): ShowModal => {
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
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};
