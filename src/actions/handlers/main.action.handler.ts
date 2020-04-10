import { BoardActionType } from 'src/types/board.types';
import { dicesModalHandler } from './modals.content';

export const adaptAction = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.SHOW_MODAL:
      return dicesModalHandler();
  }
};
