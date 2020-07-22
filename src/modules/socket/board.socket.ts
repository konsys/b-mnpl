import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { IErrorMessage, StoreService } from '../ms/action/store.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardMessageService } from '../ms/action/board.message.service';
import { FieldType } from 'src/entities/board.fields.entity';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { SocketActions } from 'src/types/game/game.types';
import _ from 'lodash';
import { subscriber } from 'src/main';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly boardService: BoardMessageService,
    private readonly store: StoreService,
  ) {}

  @WebSocketServer()
  public static socketServer: Server;

  public async emitMessage() {
    BoardSocket.socketServer.emit(
      SocketActions.BOARD_MESSAGE,
      await this.boardService.createBoardMessage('kkk'),
    );
  }

  public async emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
    await this.store.resetError('kkk');
  }

  afterInit(server: Server) {
    BoardSocket.socketServer = server;
    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);

    await this.emitMessage();
  }
}
