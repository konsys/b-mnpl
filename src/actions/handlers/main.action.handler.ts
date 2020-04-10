import { BoardActionType } from 'src/types/board.types';
import { dicesModalHandler } from './board.handlers';

export const mainActionHandler = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.ROLL_DICES:
      return dicesModalHandler();
  }
};
