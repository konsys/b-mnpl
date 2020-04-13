import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { playersStore } from 'src/stores/players.store';
import nanoid from 'nanoid';
import { IActionId } from 'src/types/board.types';

@WebSocketGateway()
export class HandleMessage {
  @SubscribeMessage(BoardActionType.SHOW_DICES_MODAL)
  async modal(client: Socket, payload: IActionId): Promise<void> {
    const action = actionsStore.getState();
    if (payload.actionId === action.actionId) {
      const userStore = playersStore.map(v => v).getState();
      const user = userStore && userStore.find(v => v.isActing === true);

      setCurrentActionsEvent({
        action: BoardActionType.ROLL_DICES,
        userId: user.userId,
        actionId: nanoid(4),
        moveId: action.moveId + 1,
        srcOfChange: 'rollDicesMessage',
      });
    }
  }

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async dices(client: Socket, payload: IActionId): Promise<void> {
    console.log(234234234, payload);
  }
}
