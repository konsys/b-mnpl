import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { IRoomState, SocketActions } from 'src/types/game/game.types';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { roomsMessageSubscriber } from 'src/main';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway(8002, { namespace: 'room' })
export class RoomsSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public static socketServer: Server;
  private logger: Logger = new Logger('RoomsSocket');

  public async emitRoomMessage(message: IRoomState[]) {
    RoomsSocket.socketServer.emit(SocketActions.ROOM_MESSAGE, message);
  }

  afterInit(server: Server) {
    RoomsSocket.socketServer = server;

    roomsMessageSubscriber.on(
      'message',
      async (chanel: SocketActions, message: string) => {
        if (chanel === SocketActions.ROOM_MESSAGE) {
          await this.emitRoomMessage(JSON.parse(message));
        }
      },
    );

    roomsMessageSubscriber.subscribe(SocketActions.ROOM_MESSAGE);

    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(` Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);
  }
}
