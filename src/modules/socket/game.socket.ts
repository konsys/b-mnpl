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
import { IErrorMessage } from '../ms/action/store.service';
import { SocketActions } from 'src/types/game/game.types';
import { gameMessageSubscriber } from 'src/main';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway(8000, { namespace: 'board' })
export class GameSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public static socketServer: Server;
  private logger: Logger = new Logger('GameSocket');

  public async emitMessage(message: any) {
    GameSocket.socketServer.emit(SocketActions.BOARD_MESSAGE, message);
  }

  public async emitError(error: IErrorMessage) {
    GameSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
  }

  afterInit(server: Server) {
    GameSocket.socketServer = server;

    gameMessageSubscriber.subscribe(BOARD_PARAMS.GAME_MESSAGE_CHANNEL);
    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);

    // await this.emitMessage();
  }
}
