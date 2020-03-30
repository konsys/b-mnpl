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
import {
  BoardMessage,
  BoardEventType,
  BoardActionTypes,
} from './model/board.model';
import nanoid from 'nanoid';
import { IGameModel, SocketActions } from './model/game.model';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { FieldService } from 'src/field/field.service';
import { random } from 'src/lib/utils';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/user/users.service';
import { access } from 'fs';

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
      const status = this.boardStatus(payload);
      console.log('rollDice', status);
      this.server.emit(SocketActions.BOARD_MESSAGE, status);
    } catch (err) {
      this.logger.error('Error' + err);
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

  private moveId = 1;
  private readonly userId = 1;
  private meanPosition = 0;

  private boardStatus = (game: IGameModel): BoardMessage => {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const moveId = nanoid();
    const sum = this.meanPosition + (dice1 + dice2 + dice3);
    this.meanPosition = sum < 40 ? sum : sum - 40;
    let events: BoardActionTypes = null;
    const meanField = this.fields.find(
      v => v.fieldPosition === this.meanPosition,
    );

    const type: any[] = [];

    if (meanField.price) {
      type.push({
        type: BoardEventType.CAN_BUY,
        userId: this.userId,
        field: this.meanPosition,
        money: 15000,
        _id: moveId,
      });
    }

    type.push({
      type: BoardEventType.ROLL_DICES,
      userId: this.userId,
      dices: [dice1, dice2, dice3],
      meanPosition: this.meanPosition,
      _id: moveId,
    });

    events = {
      type,
    };
    const players = [];

    this.players.map(v => {
      players.push({
        userData: v,
      });
    });

    return {
      code: 0,
      data: {
        id: this.moveId++,
        events,
        boardStatus: {
          players,
          // [
          //   {
          //     userData: this.players[0],
          //   },
          // ],
        },
      },
    };
  };
}
