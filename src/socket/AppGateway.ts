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

const random = (min: number, max: number) => {
  return Math.ceil(min + Math.random() * (max - min));
};
let id = 0;

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('rollDices')
  handleMessage(client: Socket, payload: string): void {
    try {
      this.logger.log(`Message: ${JSON.stringify(payload)} from ${client.id}`);
      const dice1 = random(0, 6);
      const dice2 = random(0, 6);
      const dice3 = null;
      const res = {
        code: 0,
        data: {
          id: id++,
          events: [
            {
              type: 'rollDices',
              userId: 1,
              dices: [dice1, dice2, dice3],
              meanPosition: dice1 + dice2,
              dice1,
              dice2,
              dice3,
              payload,
            },
          ],
        },
      };
      this.server.emit('rollDices', res);
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
