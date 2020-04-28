import { BoardActionType } from 'src/types/board.types';
import { dicesModalHandler, buyModalHandler } from './modals.handler';
import { rollDicesHandler } from './dices.handler';

export const adaptAction = (type: BoardActionType) => {
  switch (type) {
    case BoardActionType.ROLL_DICES_MODAL:
      return dicesModalHandler();

    case BoardActionType.ROLL_DICES:
      return rollDicesHandler();

    case BoardActionType.CAN_BUY:
      return buyModalHandler();

    case BoardActionType.PAY_RENT_START:
      return buyModalHandler();
  }
};
