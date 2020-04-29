import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { actionsStore } from 'src/stores/actions.store';
import { IActionId } from 'src/types/board.types';
import {
  isFieldEmpty,
  canBuyField,
  isTax,
  payTaxData,
  isMyField,
  isChance,
} from 'src/utils/fields.utis.';
import * as Action from 'src/utils/actions.utils';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import { moneyTransaction, userChance } from 'src/utils/users.utils';
import { randChance } from 'src/utils/chance.utils';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES_MODAL)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    payload.actionId === action.actionId && Action.rollDicesAction();
  }

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async dicesRolled(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      if (isFieldEmpty()) {
        Action.buyFieldModalAction();
      } else if (!isFieldEmpty() && !isMyField() && !isTax() && !isChance()) {
        Action.payTaxModalAction();
      } else if (isTax()) {
        Action.payTaxModalAction();
      } else if (isChance()) {
        const chanceSum = randChance();
        console.log(1111111111, chanceSum);
        chanceSum < 0 && Action.payTaxModalAction();
        userChance(chanceSum);
        // TODO оптимизировать
        Action.switchPlayerTurn();
        Action.rollDicesModalAction();
      } else {
        // TODO Добавить обработчики для остальных полей
        Action.switchPlayerTurn();
        Action.rollDicesModalAction();
      }
    }
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    if (isFieldEmpty() && canBuyField()) {
      Action.buyFieldAction();
      Action.rollDicesModalAction();
    } else {
      !isFieldEmpty() &&
        setError({
          code: ErrorCode.CompanyHasOwner,
          message: 'Oop!',
        });
      !canBuyField() &&
        setError({
          code: ErrorCode.NotEnoughMoney,
          message: 'Oop!',
        });
    }
    Action.switchPlayerTurn();
  }

  @SubscribeMessage(BoardActionType.AUCTION_START)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      Action.startAuctionAction();
      Action.switchPlayerTurn();
      Action.rollDicesModalAction();
    }
  }

  @SubscribeMessage(BoardActionType.TAX_PAID)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    const payData = payTaxData();
    moneyTransaction(payData.sum, payData.userId, payData.toUserId);

    Action.switchPlayerTurn();
    Action.rollDicesModalAction();
  }
}
