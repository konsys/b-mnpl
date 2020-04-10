import { BoardActionType } from 'src/types/board.types';
import { dicesModalHandler } from './modals.handler';
import { rollDicesHandler } from './dices.handler';

export const adaptAction = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.SHOW_MODAL:
      return dicesModalHandler();

    case BoardActionType.ROLL_DICES:
      return rollDicesHandler();
  }
};
