import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BoardActionType } from 'src/types/board.types';
import { IGameModel } from 'src/types/game.types';
import { rollDicesHandler } from 'src/actions/handlers/board.handlers';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BoardMessage {
  private logger: Logger = new Logger('BoardMessage');

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    console.log(234234234243);
    this.logger.error(`RollDices: ${client.id} ${JSON.stringify(payload)}`);
    rollDicesHandler();
  }
}
