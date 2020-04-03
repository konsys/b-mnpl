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
  BoardActionType,
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
} from './model/types/board.types';
import { IGameModel, SocketActions } from './model/types/game.types';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { FieldService } from 'src/field/field.service';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/user/users.service';
import { boardMessage } from './model/board.message';

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
    this.logger.log(`RollDices: ${client.id} ${JSON.stringify(payload)}`);
  }

  async onModuleInit() {
    this.fields = await this.fieldService.findInit();
    this.players = await this.usersService.findAll();

    try {
      setInterval(() => {
        const status = boardMessage(this.fields, this.players);
        console.log(111111, status);
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
