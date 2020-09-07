import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { IRoomResponce, SocketActions } from 'src/types/game/game.types';
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
@WebSocketGateway(8002, { namespace: 'rooms' })
export class RoomsSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public static socketServer: Server;
  private logger: Logger = new Logger('RoomsSocket');

  public async emitRoomsMessage(message: IRoomResponce) {
    RoomsSocket.socketServer.emit(SocketActions.GAME_CHAT_MESSAGE, message);
  }

  afterInit(server: Server) {
    RoomsSocket.socketServer = server;
    roomsMessageSubscriber.on(
      'message',
      async (chanel: SocketActions, message: string) => {
        if (chanel === SocketActions.ROOMS_MESSAGE) {
          await this.emitRoomsMessage(JSON.parse(message));
        }
      },
    );

    roomsMessageSubscriber.subscribe(SocketActions.ROOMS_MESSAGE);

    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(` Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);
  }
}
