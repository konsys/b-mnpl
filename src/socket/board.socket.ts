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
} from './model/board.model';
import nanoid from 'nanoid';
import { IGameModel } from './model/game.model';

const random = (min: number, max: number) => {
  return Math.ceil(min + Math.random() * (max - min));
};

let id = 0;
const userId = 1;
let meanPosition = 0;

const boardStatus = (game: IGameModel): BoardSocketMessage => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const moveId = nanoid();
  const gameId = nanoid();
  const sum = meanPosition + (dice1 + dice2 + dice3);
  meanPosition = sum < 40 ? sum : sum - 40;
  return {
    code: 0,
    data: {
      id: id++,
      events: [
        {
          type: BoardEventType.ROLL_DEICES,
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
      status: {
        players: [
          {
            userData: {
              userId: userId,
              isActive: true,
              isBlocked: false,
              vip: true,
              registrationType: 'vk',
              name: 'Konstantin',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            userGameStatus: {
              gameId: gameId,
              doublesRolledAsCombo: 1,
              jailed: false,
              unjailAttempts: 1,
              position: 1,
              money: 1,
              creditPayRound: true,
              creditNextTakeRound: 5,
              score: 120,
              frags: 'frags',
              additionalTime: 1,
              timeReduceLevel: 1,
              creditToPay: 1,
              canUseCredit: true,
              userId: userId,
            },
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
export class BoardSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('BoardSocket');

  @SubscribeMessage('rollDices')
  handleMessage(client: Socket, payload: IGameModel): void {
    console.log(23423443, payload);
    try {
      this.logger.log(`Message: ${JSON.stringify(payload)} from ${client.id}`);
      const status = boardStatus(payload);
      // setInterval(() => {
      // this.logger.log('message', JSON.stringify(status));
      //   this.server.emit('rollDices', status);
      // }, 3000);
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
