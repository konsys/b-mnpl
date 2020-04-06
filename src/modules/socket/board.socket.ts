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
import { IGameModel, SocketActions } from 'src/types/game.types';
import { boardMessage } from 'src/actions/board.message';
import { rollDicesHandler } from 'src/actions/handlers/board.handlers';
import { setPlayersEvent } from 'src/stores/players.store';
import { setFieldsEvent } from 'src/stores/fields.store';
import axios from 'axios';
import nanoid from 'nanoid';
import * as config from '../../config/settings';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');
  private gameId = nanoid(8);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    this.logger.log(`RollDices: ${client.id} ${JSON.stringify(payload)}`);
    rollDicesHandler();
  }

  async onModuleInit() {
    try {
      // TODO вынести в microservice
      let players: IPlayerStatus[] = [];
      let fields: BoardFieldsEntity[] = [];

      setFieldsEvent(fields);

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
      if (players.length > 0) {
        players[0].isActing = true;
        players = players.map(v => ({ ...v, status: initPlayerStatus }));
      }
      setPlayersEvent(players);
    } catch (err) {
      this.logger.error(JSON.stringify(err));
    }
    try {
      setInterval(() => {
        const status = boardMessage();

        this.server.emit(SocketActions.BOARD_MESSAGE, status);
      }, 2000);
    } catch (err) {
      this.logger.error('Error' + err);
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
