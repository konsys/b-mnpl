import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { IGameModel } from 'src/types/game.types';
import { Socket } from 'socket.io';
import { setCurrentActionsEvent } from 'src/stores/actions.store';
import { playersStore } from 'src/stores/players.store';

@WebSocketGateway()
export class BoardMessage {
  private logger: Logger = new Logger('BoardMessage');

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    this.logger.error(`RollDices: ${client.id} ${JSON.stringify(payload)}`);

    const userStore = playersStore.map(v => v).getState();
    const user = userStore && userStore.find(v => v.isActing === true);
    setCurrentActionsEvent({
      action: BoardActionType.ROLL_DICES,
      userId: user.userId,
      srcOfChange: 'rollDicesMessage',
    });
  }
}
