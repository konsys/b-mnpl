import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  ERROR_CHANEL,
  IErrorMessage,
  StoreService,
} from 'src/api.gateway/action/store.service';
import { IField, IFieldAction, IPlayer } from 'src/types/Board/board.types';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardMessageService } from 'src/api.gateway/action/board.message.service';
import { FieldType } from 'src/entities/board.fields.entity';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { FieldsUtilsService } from 'src/api.gateway/action/fields.utils.service';
import { SocketActions } from 'src/types/Game/game.types';
import _ from 'lodash';
import { subscriber } from 'src/main';

const bank: IPlayer = {
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 100000,
  password: 'bank',
  vip: true,
  registrationType: 'none',
  name: 'BANK',
  email: 'b@b.ru',
  team: null,
  avatar: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: false,
  isBlocked: true,
  isActing: false,
  gameId: '',
  doublesRolledAsCombo: 0,
  jailed: 0,
  unjailAttempts: 0,
  meanPosition: 0,
  creditPayRound: false,
  creditNextTakeRound: 0,
  score: 0,
  additionalTime: 0,
  timeReduceLevel: 0,
  creditToPay: 0,
  canUseCredit: false,
  moveOrder: 0,
  isAlive: false,
  movesLeft: 0,
};

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly fieldsService: FieldsService,
    private readonly fields: FieldsUtilsService,
    private readonly boardService: BoardMessageService,
    private readonly store: StoreService,
  ) {}

  @WebSocketServer()
  public static socketServer: Server;

  async onModuleInit() {
    await this.store.flushGame('kkk');
    await this.initStores('kkk');

    try {
      setInterval(() => {
        // BoardSocket.emitMessage();
      }, 8000);
    } catch (err) {
      this.logger.error('Error on onModuleInit' + err);
    }
  }

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

  private async initStores(gameId: string) {
    this.store;
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

      await this.store.setBoardStore(gameId, {
        isNewRound: false,
        gameRound: 0,
        playersTurn: 0,
        playerActions: [],
      });
      this.store.setBankStore('kkk', bank);

      const ch = `kkk-${ERROR_CHANEL}`;
      subscriber.on('message', async (chanel: any, message: string) => {
        await this.emitError(JSON.parse(message));
      });
      subscriber.subscribe(ch);
    } catch (err) {
      this.logger.error(`Error on initStores: ${JSON.stringify(err)}`);
    }
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
