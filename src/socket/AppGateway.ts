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

const event = {
  code: 0,
  data: {
    id: 27,
    events: [
      {
        type: 'rollDices',
        user_id: 429935,
        dices: [3, 3],
        mean_position: 19,
        _id: 'CVyd5uLaAF4=',
      },
      {
        type: 'canBuy',
        user_id: 429935,
        field: 19,
        money: 2000,
        _id: 'CVyd5uLaAF8=',
      },
    ],
    status: {
      players: [
        {
          user_id: 931362,
          status: 0,
          vip: false,
          doublesRolledAsCombo: 0,
          jailed: false,
          unjailAttempts: 0,
          position: 14,
          money: 12400,
          can_use_credit: false,
          credit_payRound: false,
          credit_toPay: 0,
          credit_nextTakeRound: 20,
          score: 0,
          frags: [],
          additional_time: 0,
          timeReduceLevel: 0,
        },
        {
          user_id: 599618,
          status: 0,
          vip: false,
          doublesRolledAsCombo: 1,
          jailed: false,
          unjailAttempts: 0,
          position: 34,
          money: 10160,
          can_use_credit: false,
          credit_payRound: false,
          credit_toPay: 0,
          credit_nextTakeRound: 20,
          score: 60,
          frags: [],
          additional_time: 0,
          timeReduceLevel: 0,
        },
        {
          user_id: 1311322,
          status: 0,
          vip: false,
          doublesRolledAsCombo: 1,
          jailed: false,
          unjailAttempts: 0,
          position: 20,
          money: 8400,
          can_use_credit: false,
          credit_payRound: false,
          credit_toPay: 0,
          credit_nextTakeRound: 20,
          score: 100,
          frags: [],
          additional_time: 0,
          timeReduceLevel: 0,
        },
        {
          user_id: 429935,
          status: 0,
          vip: false,
          doublesRolledAsCombo: 1,
          jailed: false,
          unjailAttempts: 0,
          position: 19,
          money: 14840,
          can_use_credit: false,
          credit_payRound: false,
          credit_toPay: 0,
          credit_nextTakeRound: 20,
          score: 0,
          frags: [],
          additional_time: 0,
          timeReduceLevel: 0,
        },
      ],
      player_ownerOfMove: 429935,
      round: 2,
      action_player: 429935,
      action_type: ['buy', 'toAuction', 'levelDown', 'contract', 'mortgage'],
      current_move: {
        dices: [3, 3],
        dices_sum: 6,
        is_triple: false,
        is_double: true,
      },
      dices: [3, 3],
      dices_sum: 6,
      is_triple: false,
      is_double: true,
      fields: [
        {
          owner: 599618,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 931362,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 599618,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 1311322,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 931362,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 1311322,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 599618,
          level: 0,
          mortgaged: false,
        },
        {
          owner: 1311322,
          level: 0,
          mortgaged: false,
        },
      ],
      timeout_ts: 1584619921,
      timeout_is_additional: false,
      pause_data: { is_active: false },
      is_active: false,
      viewers: 0,
      time: { ts_start: 1584619685377, ts_now: 1584619831179, inactive: 0 },
      ts_start: 1584619685377,
      ts_now: 1584619831179,
      inactive: 0,
    },
  },
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
      const dice1 = random(0, 6);
      const dice2 = random(0, 6);

      const dice3 = 0;
      const res = {
        code: 0,
        data: {
          id: id++,
          events: [
            {
              type: 'rollDices',
              userId: 1,
              dices: [dice1, dice2, dice3],
              meanPosition: dice1 + dice2 + dice3 + 0,
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
