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
  BoardSocketMessage,
  BoardEventType,
  BoardFieldActions,
} from './BoardModel';
import nanoid from 'nanoid';

const random = (min: number, max: number) => {
  return Math.ceil(min + Math.random() * (max - min));
};
let id = 0;
const userId = 1;

const boardStatus = (): BoardSocketMessage => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const moveId = nanoid();
  return {
    code: 0,
    data: {
      id: 27,
      events: [
        {
          type: BoardEventType.ROLL_DEICES,
          userId: userId,
          dices: [dice1, dice2, dice3],
          meanPosition: 19,
          _id: moveId,
        },
        {
          type: BoardEventType.CAN_BUY,
          userId: userId,
          field: 19,
          money: 2000,
          _id: moveId,
        },
      ],
      status: {
        players: [
          {
            userId: userId,
            status: 0,
            vip: true,
            doublesRolledAsCombo: 0,
            jailed: false,
            unjailAttempts: 0,
            position: 14,
            money: 12400,
            canUseCredit: false,
            creditPayRound: false,
            creditToPay: 0,
            creditNextTakeRound: 20,
            score: 0,
            frags: [1],
            additionalTime: 0,
            timeReduceLevel: 0,
          },
        ],
        moveStatus: {
          moveId,
          playerOwnerOfMove: 429935,
          round: 2,
          actionPlayer: 429935,
          actionType: [
            BoardFieldActions.BUY,
            BoardFieldActions.TO_AUCTION,
            BoardFieldActions.LEVEL_DOWN,
            BoardFieldActions.CONTRACT,
            BoardFieldActions.MORTGAGE,
          ],
          currentMove: {
            dices: [dice1, dice2, dice3],
            dicesSum: dice1 + dice2 + dice3,
            isTriple: false,
            isDouble: true,
          },
        },

        fields: [
          {
            owner: 599618,
            level: 0,
            mortgaged: false,
          },
        ],
        timers: {
          timeoutTs: 1584619921,
          timeoutIsAdditional: false,
          pauseData: {
            isActive: false,
            viewers: 0,
            tsStart: 1584619685377,
            tsNow: 1584619831179,
            inactive: 0,
          },
        },
      },
    },
  };
};

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
      const status = boardStatus();
      this.server.emit('rollDices', status);
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
