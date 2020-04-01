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
  BoardActionType,
  BoardActionTypes,
  Motrgage,
  AuctionDecline,
  AuctionAccept,
  LevelUp,
  LevelDown,
  PayRentSuccess,
  PayRentFail,
  TypeBuy,
  RollDices,
  CanBuy,
  ShowModal,
  BoardModalTypes,
} from './model/types/board.types';
import nanoid from 'nanoid';
import { IGameModel, SocketActions } from './model/types/game.types';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { FieldService } from 'src/field/field.service';
import { random } from 'src/lib/utils';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/user/users.service';

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

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    this.logger.log(`RollDices: ${client.id}`);
  }

  async onModuleInit(payload) {
    this.fields = await this.fieldService.findInit();
    this.players = await this.usersService.findAll();

    try {
      const status = this.boardStatus(payload);
      setInterval(() => {
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

  private moveId = 1;
  private readonly userId = 1;
  private meanPosition = 0;

  private boardStatus = (game: IGameModel): BoardMessage => {
    const dice1 = random(0, 6);
    const dice2 = random(0, 6);
    const dice3 = 0;
    const sum = this.meanPosition + (dice1 + dice2 + dice3);
    this.meanPosition = sum < 40 ? sum : sum - 40;
    let events: BoardActionTypes = null;
    const meanField = this.fields.find(
      v => v.fieldPosition === this.meanPosition,
    );

    const type: Array<
      | Motrgage
      | AuctionDecline
      | AuctionAccept
      | LevelUp
      | LevelDown
      | PayRentSuccess
      | PayRentFail
      | TypeBuy
      | RollDices
      | CanBuy
      | ShowModal
    > = [];

    // if (meanField.price > 0) {
    //   type.push({
    //     type: BoardActionType.CAN_BUY,
    //     userId: this.userId,
    //     field: this.meanPosition,
    //     money: 15000,
    //     _id: moveId,
    //   });
    // } else {
    //   type.push({
    //     type: BoardActionType.ROLL_DICES,
    //     userId: this.userId,
    //     dices: [dice1, dice2, dice3],
    //     meanPosition: this.meanPosition,
    //     _id: moveId,
    //   });
    // }

    type.push({
      type: BoardActionType.SHOW_MODAL,
      userId: this.userId,
      title: 'Кидайте кубики',
      text: 'Мы болеем за вас',
      modalType: BoardModalTypes.ROLL_DICES,
      _id: nanoid(4),
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
        },
      },
    };
  };
}
