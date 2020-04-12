import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { IGameModel } from 'src/types/game.types';
import { Socket } from 'socket.io';
import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { playersStore } from 'src/stores/players.store';
import nanoid from 'nanoid';

@WebSocketGateway()
export class HandleMessage {
  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    const userStore = playersStore.map(v => v).getState();
    const user = userStore && userStore.find(v => v.isActing === true);
    const action = actionsStore.getState();

    setCurrentActionsEvent({
      action: BoardActionType.ROLL_DICES,
      userId: user.userId,
      actionId: nanoid(4),
      moveId: action.moveId + 1,
      srcOfChange: 'rollDicesMessage',
    });
  }
}
