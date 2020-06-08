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
import { IPlayer, OutcomeMessageType } from 'src/types/board.types';
import { SocketActions } from 'src/types/game.types';
import { createBoardMessage } from 'src/socket.messages/send.message';
import { UsersService } from '../../api.gateway/users/users.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { updateAction } from 'src/stores/actions.store';
import nanoid from 'nanoid';
import { errorStore, IErrorMessage } from 'src/stores/error.store';
import { updateAllPLayers } from 'src/utils/users.utils';
import { updateAllFields } from 'src/utils/fields.utils';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  constructor(
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
  ) {}

  @WebSocketServer()
  public static socketServer: Server;

  async onModuleInit() {
    await this.initStores();
    try {
      setInterval(() => {
        // BoardSocket.emitMessage();
      }, 8000);
    } catch (err) {
      this.logger.error('Error' + err);
    }
  }

  public static emitMessage() {
    BoardSocket.socketServer.emit(
      SocketActions.BOARD_MESSAGE,
      createBoardMessage(),
    );
  }

  public emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
    errorStore.reset();
  }

  private async initStores() {
    try {
      let players: IPlayer[] = await this.usersService.getAllUsers();
      const resultPlayers = [];
      if (players.length > 0) {
        // Случайная очередь ходов
        const ids = players.map(v => v.userId).sort(() => Math.random() - 0.5);

        // Заполняем статус
        players = players.map((v, k) => ({
          ...v,
          gameId: 'gameId',
          doublesRolledAsCombo: 0,
          jailed: 0,
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
          moveOrder: ids.findIndex(id => id === v.userId),
          isActing: ids[0] === v.userId,
          movesLeft: 0,
        }));

        // Заполняем массив в порядке очереди ходов
        ids.map(id => {
          resultPlayers.push(players.find(v => v.userId === id));
        });

        updateAction({
          action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
          userId: resultPlayers.find(v => v.moveOrder === 0).userId,
          moveId: 0,
          actionId: nanoid(4),
        });
      }

      updateAllPLayers(resultPlayers);
      updateAllFields(await this.fieldsService.getInitialFields());
      errorStore.updates.watch(error => this.emitError(error));
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

    BoardSocket.emitMessage();
  }
}
