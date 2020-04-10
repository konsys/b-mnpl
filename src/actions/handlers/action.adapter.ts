import { BoardActionType } from 'src/types/board.types';
import { dicesModalHandler } from './modals.handler';

export const adaptAction = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.SHOW_MODAL:
      return dicesModalHandler();

    case BoardActionType.ROLL_DICES:
      return dicesModalHandler();
  }
};
