import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { actionsStore } from 'src/stores/actions.store';
import { IActionId } from 'src/types/board.types';
import { canBuyField } from 'src/utils/fields.utis.';
import {
  buyFieldModalAction,
  rollDicesAction,
  buyFieldAction,
  rollDicesModalAction,
} from 'src/utils/actions.utils';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES_MODAL)
  async modal(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    payload.actionId === action.actionId && rollDicesAction();
  }

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async dicesRolled(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    payload.actionId === action.actionId &&
      canBuyField() &&
      buyFieldModalAction();
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    canBuyField(true) ? buyFieldAction() : buyFieldModalAction();
    rollDicesModalAction();
  }
}
