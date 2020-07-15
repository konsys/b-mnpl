import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { IPlayer, IField, IFieldAction } from 'src/types/Board/board.types';
import { SocketActions } from 'src/types/Game/game.types';
import { UsersService } from '../api.gateway/users/users.service';
import { FieldsService } from '../api.gateway/fields/fields.service';
import { errorStore, IErrorMessage } from 'src/stores/error.store';
import _ from 'lodash';
import { FieldType } from 'src/entities/board.fields.entity';
import { BoardMessageService } from 'src/api.gateway/board.message/board.message.service';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
    private readonly boardService: BoardMessageService,
  ) {}

  @WebSocketServer()
  public static socketServer: Server;

  async onModuleInit() {
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
      await this.boardService.createBoardMessage(),
    );
  }

  public emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
    errorStore.reset();
  }

  private async initStores(gameId: string) {
    try {
      let players: IPlayer[] = await this.usersService.getAllUsers();

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
      await this.fieldsService.updateAllFields(gameId, r);

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
