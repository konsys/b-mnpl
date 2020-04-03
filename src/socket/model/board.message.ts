import { random } from 'src/lib/utils';
import {
  BoardActionTypes,
  BoardMessage,
  Motrgage,
  AuctionAccept,
  AuctionDecline,
  LevelDown,
  LevelUp,
  PayRentSuccess,
  PayRentFail,
  TypeBuy,
  RollDices,
  CanBuy,
  ShowModal,
} from './types/board.types';
import { rollDicesHandler } from './actions/board.handlers';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { IPlayerStatus } from 'src/socket/model/types/board.types';
import { UsersEntity } from 'src/entities/users.entity';

let type: Array<
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

let meanPosition = 0;

export const boardMessage = (
  fields: BoardFieldsEntity[],
  users: UsersEntity[],
): BoardMessage => {
  const dice1 = random(0, 6);
  const dice2 = random(0, 6);
  const dice3 = 0;
  const sum = this.meanPosition + (dice1 + dice2 + dice3);
  this.meanPosition = sum < 40 ? sum : sum - 40;
  let events: BoardActionTypes = null;
  type = [];
  const meanField = fields.find(v => v.fieldPosition === meanPosition);

  type.push(rollDicesHandler(this.userId));

  events = {
    type,
  };

  const players = [];

  users.map(v => {
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
