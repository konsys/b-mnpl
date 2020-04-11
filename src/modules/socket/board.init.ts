import {
  SubscribeMessage,
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
import {
  BoardActionType,
  IPlayerStatus,
  UserGameStatus,
} from 'src/types/board.types';
import { SocketActions } from 'src/types/game.types';
import { createBoardMessage } from 'src/actions/create.message';
import { setPlayersEvent } from 'src/stores/players.store';
import { setFieldsEvent } from 'src/stores/fields.store';
import { UsersService } from '../../api.gateway/users/users.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { setCurrentActionsEvent } from 'src/stores/actions.store';
import nanoid from 'nanoid';

const initPlayerStatus: UserGameStatus = {
  gameId: this.gameId,
  doublesRolledAsCombo: 0,
  jailed: false,
  unjailAttempts: 0,
  meanPosition: 0,
  money: 15000,
  creditPayRound: false,
  creditNextTakeRound: 0,
  score: 0,
  timeReduceLevel: 0,
  creditToPay: 0,
  frags: '',
  additionalTime: 0,
  canUseCredit: false,
};
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocketInit
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
  ) {}

  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    await this.initStores();
    try {
      setInterval(() => {
        this.server.emit(SocketActions.BOARD_MESSAGE, createBoardMessage());
      }, 2000);
    } catch (err) {
      this.logger.error('Error' + err);
    }
  }

  private async initStores() {
    try {
      let players: IPlayerStatus[] = await this.usersService.getAllUsers();
      if (players.length > 0) {
        players[0].isActing = true;
        players = players.map(v => ({ ...v, status: initPlayerStatus }));

        setCurrentActionsEvent({
          action: BoardActionType.SHOW_MODAL,
          userId: players[0].userId,
          actionId: nanoid(4),
          srcOfChange: 'initStores',
        });
      }
      setPlayersEvent(players);
      setFieldsEvent(await this.fieldsService.getInitialFields());
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err)}`);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);
  }
}
