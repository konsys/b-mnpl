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
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { FieldService } from 'src/field/field.service';
import { random } from 'src/lib/utils';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/user/users.service';

let id = 0;
const userId = 1;
let meanPosition = 0;

const boardStatus = (
  game: IGameModel,
  fields: BoardFieldsEntity[],
): BoardMessage => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const moveId = nanoid();
  // const gameId = nanoid();
  const sum = meanPosition + (dice1 + dice2 + dice3);
  meanPosition = sum < 40 ? sum : sum - 40;

  const field = fields.find(v => v.fieldPosition === meanPosition);
  console.log(23423434, field);
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
  private fields: BoardFieldsEntity[] = [];
  private players: UsersEntity[] = [];

  constructor(
    private fieldService: FieldService,
    private usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(BoardEventType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    try {
      this.logger.log(`Message: ${JSON.stringify(payload)} from ${client.id}`);
      const status = boardStatus(payload, this.fields);

      this.server.emit(SocketActions.BOARD_MESSAGE, status);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async onModuleInit() {
    this.fields = await this.fieldService.findInit();
    this.players = await this.usersService.findAll();
    this.logger.warn(
      `fields: ${JSON.stringify(this.fields.map(v => v.fieldId))}`,
    );
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
