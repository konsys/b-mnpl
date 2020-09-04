import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BOARD_PARAMS } from 'src/params/board.params';
import { IGameSocketMessage } from 'src/types/game/game.types';
import { SocketActions } from 'src/types/game/game.types';
import { gameMessageSubscriber } from 'src/main';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway(8001, { namespace: 'game' })
export class GameSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public static socketServer: Server;
  private logger: Logger = new Logger('GameSocket');

  public async emitMessage(message: IGameSocketMessage) {
    GameSocket.socketServer.emit(SocketActions.GAME_MESSAGE, message);
  }

  afterInit(server: Server) {
    GameSocket.socketServer = server;

    gameMessageSubscriber.on(
      'message',
      async (chanel: any, message: string) => {
        await this.emitMessage(JSON.parse(message));
      },
    );

    gameMessageSubscriber.subscribe(BOARD_PARAMS.GAME_MESSAGE_CHANNEL);

    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);
  }
}
