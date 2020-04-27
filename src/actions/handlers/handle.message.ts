import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { actionsStore } from 'src/stores/actions.store';
import { IActionId } from 'src/types/board.types';
import { isFieldEmpty, canBuyField } from 'src/utils/fields.utis.';
import {
  buyFieldModalAction,
  rollDicesAction,
  buyFieldAction,
  rollDicesModalAction,
  startAuctionAction,
  switchPlayerTurn,
} from 'src/utils/actions.utils';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES_MODAL)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    payload.actionId === action.actionId && rollDicesAction();
  }

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async dicesRolled(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      isFieldEmpty() ? buyFieldModalAction() : rollDicesModalAction();
    }
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    if (isFieldEmpty() && canBuyField()) {
      buyFieldAction();
      rollDicesModalAction();
    } else {
      setError({
        code: ErrorCode.NotEnoughMoney,
        message: 'You don`t have enough money to buy this field',
      });
    }
  }

  @SubscribeMessage(BoardActionType.AUCTION_START)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      startAuctionAction();
      rollDicesModalAction();
    }
  }
}
