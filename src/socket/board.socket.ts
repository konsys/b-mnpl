import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { BoardMessage, BoardEventType } from './model/board.model';
import nanoid from 'nanoid';
import { IGameModel, SocketActions } from './model/game.model';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Repository } from 'typeorm';

const random = (min: number, max: number) => {
  return Math.ceil(min + Math.random() * (max - min));
};

let id = 0;
const userId = 1;
let meanPosition = 0;

const boardStatus = (game: IGameModel): BoardMessage => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const moveId = nanoid();
  // const gameId = nanoid();
  const sum = meanPosition + (dice1 + dice2 + dice3);
  meanPosition = sum < 40 ? sum : sum - 40;

  return {
    code: 0,
    data: {
      id: id++,
      events: [
        {
          type: BoardEventType.ROLL_DICES,
          userId: userId,
          dices: [dice1, dice2, dice3],
          meanPosition,
          _id: moveId,
        },
        {
          type: BoardEventType.CAN_BUY,
          userId: userId,
          field: meanPosition,
          money: 2000,
          _id: moveId,
        },
      ],
    },
  };
};

@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');

  // constructor(
  //   @InjectRepository(BoardFieldsEntity)
  //   private fieldService: Repository<BoardFieldsEntity>,
  // ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(BoardEventType.ROLL_DICES)
  public rollDices(client: Socket, payload: IGameModel): void {
    try {
      this.logger.log(`Message: ${JSON.stringify(payload)} from ${client.id}`);
      const status = boardStatus(payload);

      this.server.emit(SocketActions.BOARD_MESSAGE, status);
    } catch (err) {
      this.logger.error(err);
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
