import {
  ClassSerializerInterceptor,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { IChatMessage, SocketActions } from 'src/types/game/game.types';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { chatMessageSubscriber } from 'src/main';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway(8001, { namespace: 'gameChat' })
export class GameChatSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public static socketServer: Server;
  private logger: Logger = new Logger('GameChatSocket');

  public async emitChatMessage(message: IChatMessage[]) {
    GameChatSocket.socketServer.emit(SocketActions.GAME_CHAT_MESSAGE, message);
  }

  afterInit(server: Server) {
    GameChatSocket.socketServer = server;

    chatMessageSubscriber.on(
      'message',
      async (chanel: SocketActions, message: string) => {
        if (chanel === SocketActions.GAME_CHAT_MESSAGE) {
          await this.emitChatMessage(JSON.parse(message));
        }
      },
    );

    chatMessageSubscriber.subscribe(SocketActions.GAME_CHAT_MESSAGE);

    this.logger.log('Init: ' + server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id} args: ${args}`);
  }
}
