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
  updateUserBalance,
  getActingPlayer,
  unJailPlayer,
  goToJail,
} from 'src/utils/users.utils';
import { START_BONUS } from 'src/utils/board.params.utils';

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

    if (payload.actionId === action.actionId) {
      if (!player.jailed) {
        if (!noActionField()) {
          if (isCompanyForSale()) {
            console.log('2');
            Action.buyFieldModalAction();
          } else if (isStart()) {
            console.log('3');
            updateUserBalance(START_BONUS);
            Action.switchPlayerTurn();
          } else if (isTax()) {
            console.log('4');
            Action.payTaxModalAction();
          } else if (isJail()) {
            console.log('5');
            //TODO JAIL
            goToJail();
            Action.switchPlayerTurn();
          } else if (isChance()) {
            // console.log('6');
            //TODO Sum of chance
            updateUserBalance(-500);
            Action.switchPlayerTurn();
          } else {
            // console.log('7');
            // TODO Добавить обработчики для остальных полей
            Action.switchPlayerTurn();
          }
        } else {
          // console.log('8');
          Action.switchPlayerTurn();
        }
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
    Action.switchPlayerTurn();
  }
}
