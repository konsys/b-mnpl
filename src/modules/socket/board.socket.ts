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
import { boardMessageSubscriber, errorSubscriber } from 'src/main';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardMessage } from 'src/types/board/board.types';
import { IErrorMessage } from '../ms/action/store.service';
import { SocketActions } from 'src/types/game/game.types';
import _ from 'lodash';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway(8000, { namespace: 'board' })
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  @WebSocketServer()
  public static socketServer: Server;

  public async emitMessage(message: BoardMessage) {
    BoardSocket.socketServer.emit(SocketActions.BOARD_MESSAGE, message);
  }

  public async emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
  }

  afterInit(server: Server) {
    BoardSocket.socketServer = server;
    errorSubscriber.on('message', async (chanel: any, message: string) => {
      await this.emitError(JSON.parse(message));
    });
    errorSubscriber.subscribe(BOARD_PARAMS.ERROR_CHANNEL);

    boardMessageSubscriber.on(
      'message',
      async (chanel: any, message: string) => {
        await this.emitMessage(JSON.parse(message));
      },
    );
    boardMessageSubscriber.subscribe(BOARD_PARAMS.BOARD_MESSAGE_CHANNEL);
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
