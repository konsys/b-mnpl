import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import nanoid from 'nanoid';
import { IActionId } from 'src/types/board.types';
import { getActingPlayer, getField } from 'src/utils/users';
import { fieldsStore } from 'src/stores/fields.store';

@WebSocketGateway()
export class HandleMessage {
  @SubscribeMessage(BoardActionType.SHOW_DICES_MODAL)
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
  async dices(client: Socket, payload: IActionId): Promise<void> {
    const user = getActingPlayer();
    const action = actionsStore.getState();

    if (payload.actionId === action.actionId) {
      const currentField = getField(user.meanPosition);
      if (
        currentField &&
        currentField.price &&
        currentField.price <= user.money
      ) {
        setCurrentActionsEvent({
          action: BoardActionType.CAN_BUY,
          userId: user.userId,
          actionId: nanoid(4),
          moveId: action.moveId + 1,
          srcOfChange: 'rollDicesMessage dices buy',
        });
      } else {
        setCurrentActionsEvent({
          action: BoardActionType.SHOW_DICES_MODAL,
          userId: user.userId,
          actionId: nanoid(4),
          moveId: action.moveId + 1,
          srcOfChange: 'rollDicesMessage dices roll',
        });
      }
    }
  }
}
