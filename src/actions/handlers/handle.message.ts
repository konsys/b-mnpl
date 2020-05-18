import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { actionsStore } from 'src/stores/actions.store';
import { IActionId } from 'src/types/board.types';
import {
  isCompanyForSale,
  canBuyField,
  isTax,
  isStart,
  payTaxData,
  isMyField,
  isChance,
  noActionField,
  isJail,
} from 'src/utils/fields.utils';
import * as Action from 'src/utils/actions.utils';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import {
  moneyTransaction,
  userBalanceChange,
  getActingPlayer,
  unJailPlayer,
} from 'src/utils/users.utils';
import { START_BONUS } from 'src/utils/board.params.utils';
import { getActingField } from 'src/utils/fields.utils';

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
    const player = getActingPlayer();

    if (!player.jailed) {
      if (!noActionField()) {
        console.log(1111111, getActingField().type);
        if (payload.actionId === action.actionId) {
          Action.switchPlayerTurn();
        } else if (isCompanyForSale()) {
          console.log('isFieldEmpty');
          Action.buyFieldModalAction();
        } else if (isStart()) {
          console.log('isStart');
          userBalanceChange(START_BONUS);
          Action.switchPlayerTurn();
        } else if (isTax()) {
          console.log('isTax');
          Action.payTaxModalAction();
        } else if (isJail()) {
          console.log('isJail');
          //TODO JAIL
          userBalanceChange(50000);
          Action.switchPlayerTurn();
        } else if (isChance()) {
          //TODO Sum of chance
          userBalanceChange(111111);
          Action.switchPlayerTurn();
        } else if (isStart()) {
          console.log('isStart');
          userBalanceChange(START_BONUS);
          Action.switchPlayerTurn();
        } else if (isTax()) {
          console.log('isTax');
          Action.payTaxModalAction();
        } else if (isJail()) {
          console.log('isJail');
          userBalanceChange(50000);
          Action.switchPlayerTurn();
        } else {
          // TODO Добавить обработчики для остальных полей
          Action.switchPlayerTurn();
        }
      } else {
        Action.switchPlayerTurn();
      }
    }
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    if (isCompanyForSale() && canBuyField()) {
      Action.buyFieldAction();
    } else {
      !isCompanyForSale() &&
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
    }
  }

  @SubscribeMessage(BoardActionType.TAX_PAID)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    const payData = payTaxData();
    moneyTransaction(payData.sum, payData.userId, payData.toUserId);

    Action.switchPlayerTurn();
  }

  @SubscribeMessage(BoardActionType.UN_JAIL_PAID)
  async unjailPayment(client: Socket, payload: IActionId): Promise<void> {
    unJailPlayer();
    Action.switchPlayerTurn(true);
  }
}
