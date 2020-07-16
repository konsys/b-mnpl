import {
  ClassSerializerInterceptor,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { IErrorMessage, errorStore } from 'src/stores/error.store';
import { IField, IFieldAction } from 'src/types/Board/board.types';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BoardMessageService } from 'src/api.gateway/action/board.message.service';
import { FieldType } from 'src/entities/board.fields.entity';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { FieldsUtilsService } from 'src/api.gateway/action/fields.utils.service';
import { SocketActions } from 'src/types/Game/game.types';
import _ from 'lodash';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly fieldsService: FieldsService,
    private readonly fields: FieldsUtilsService,
    private readonly boardService: BoardMessageService,
  ) {}

  @WebSocketServer()
  public static socketServer: Server;

  async onModuleInit() {
    console.log(123123123);
    await this.initStores('kkk');
    try {
      setInterval(() => {
        // BoardSocket.emitMessage();
      }, 8000);
    } catch (err) {
      this.logger.error('Error' + err);
    }
  }

  public async emitMessage() {
    BoardSocket.socketServer.emit(
      SocketActions.BOARD_MESSAGE,
      await this.boardService.createBoardMessage('kkk'),
    );
  }

  public emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
    errorStore.reset();
  }

  private async initStores(gameId: string) {
    try {
      const fields: IField[] = await this.fieldsService.getInitialFields();
      const r = fields.map((v: IField, k) => ({
        ...v,
        status: v.type === FieldType.COMPANY &&
          v.fieldGroup === 1 &&
          k < 4 && {
            fieldId: v.fieldId,
            userId: 2,
            branches: 0,
            mortgaged: 0,
            fieldActions: [IFieldAction.MORTGAGE],
          },
      }));
      await this.fields.updateAllFields(gameId, r);

      errorStore.updates.watch((error) => this.emitError(error));
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err)}`);
    }
  }

  afterInit(server: Server) {
    BoardSocket.socketServer = server;
    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);

    this.emitMessage();
  }
}
