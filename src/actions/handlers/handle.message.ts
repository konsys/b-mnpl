import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import nanoid from 'nanoid';
import { IActionId } from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users.utils';
import { findFieldByPosition, canBuyField } from 'src/utils/fields.utis.';
import {
  buyFieldModalAction,
  rollDicesAction,
  buyFieldAction,
} from 'src/utils/actions.utils';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES_MODAL)
  async modal(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      const user = getActingPlayer();

      if (payload.actionId === action.actionId) {
        setCurrentActionsEvent({
          action: BoardActionType.ROLL_DICES,
          userId: user.userId,
          actionId: nanoid(4),
          moveId: action.moveId + 1,
          srcOfChange: 'rollDicesMessage modal',
        });
      }
    }
  }

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async dicesRolled(client: Socket, payload: IActionId): Promise<void> {
    const user = getActingPlayer();
    const action = actionsStore.getState();

    if (payload.actionId === action.actionId) {
      canBuyField() ? buyFieldModalAction(user) : rollDicesAction(user);
    }
  }

  @SubscribeMessage(BoardActionType.CAN_BUY)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    canBuyField() && buyFieldAction();
    const user = getActingPlayer();
    rollDicesAction(user);
  }
}
