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
  isChance,
  noActionField,
  isJail,
  getActingField,
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
import { BoardSocket } from 'src/modules/socket/board.init';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES_MODAL)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    console.log(111111111111, 'ROLL_DICES_MODAL');
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      Action.rollDicesAction();

      BoardSocket.emitMessage();
    }
  }

  @SubscribeMessage(BoardActionType.PLAYER_ROLL_DICES)
  async dicesRolled(client: Socket, payload: IActionId): Promise<void> {
    console.log(22222222222, 'PLAYER_ROLL_DICES');

    const action = actionsStore.getState();
    const player = getActingPlayer();

    if (payload.actionId === action.actionId) {
      if (!player.jailed) {
        noActionField() && Action.switchPlayerTurn();

        isCompanyForSale() && Action.buyFieldModalAction();

        isJail() && goToJail() && Action.switchPlayerTurn();

        isStart() &&
          updateUserBalance(START_BONUS) &&
          Action.switchPlayerTurn();
        // if (noActionField()) {
        //   // console.log('8', player);

        //   !player.jailed && Action.switchPlayerTurn();
        // } else if (isCompanyForSale()) {
        //   // console.log('isCompanyForSale', player.name);
        //   Action.buyFieldModalAction();
        // } else if (isStart()) {
        //   // console.log('isStart', player.name);
        //   updateUserBalance(START_BONUS);
        //   Action.switchPlayerTurn();
        // } else if (isTax()) {
        //   // console.log('isTax', player.name);
        //   Action.payTaxModalAction();
        // } else if (isJail()) {
        //   // console.log('isJail', player.name);
        //   //TODO JAIL
        //   goToJail();
        //   Action.switchPlayerTurn();
        // } else if (isChance()) {
        //   // console.log('isChance', player.name);
        //   //TODO Sum of chance
        //   updateUserBalance(-500);

        //   Action.switchPlayerTurn();
        // }
      }

      BoardSocket.emitMessage();
    }
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
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
      BoardSocket.emitMessage();
    }
  }

  @SubscribeMessage(BoardActionType.AUCTION_START)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      if (payload.actionId === action.actionId) {
        Action.startAuctionAction();
        Action.switchPlayerTurn();
      }

      BoardSocket.emitMessage();
    }
  }

  @SubscribeMessage(BoardActionType.TAX_PAID)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      const payData = payTaxData();
      moneyTransaction(payData.sum, payData.userId, payData.toUserId);

      Action.switchPlayerTurn();
      BoardSocket.emitMessage();
    }
  }

  @SubscribeMessage(BoardActionType.UN_JAIL_PAID)
  async unjailPayment(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      unJailPlayer();
      Action.rollDicesAction();

      BoardSocket.emitMessage();
    }
  }
}
