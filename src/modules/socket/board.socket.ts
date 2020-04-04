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
import { BoardActionType, IPlayerStatus } from 'src/types/board.types';
import { IGameModel, SocketActions } from 'src/types/game.types';
import { FieldService } from 'src/modules/field/field.service';
import { UsersService } from 'src/modules/user/users.service';
import { boardMessage } from 'src/actions/board.message';
import { rollDicesHandler } from 'src/actions/handlers/board.handlers';
import { setPlayersEvent } from 'src/stores/players.store';
import { setFieldsEvent } from 'src/stores/fields.store';
import nanoid from 'nanoid';

@WebSocketGateway()
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('BoardSocket');
  private gameId = nanoid(8);

  constructor(
    private fieldService: FieldService,
    private usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(BoardActionType.ROLL_DICES)
  async rollDices(client: Socket, payload: IGameModel): Promise<void> {
    this.logger.log(`RollDices: ${client.id} ${JSON.stringify(payload)}`);
    rollDicesHandler(payload);
  }

  async onModuleInit() {
    setFieldsEvent(await this.fieldService.findInit());
    const players: IPlayerStatus[] = await this.usersService.findAll();

    if (players.length > 0) {
      players[0].isActing = true;
    }
    setPlayersEvent(players);

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
