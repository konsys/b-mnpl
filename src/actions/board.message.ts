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
} from '../types/board.types';
import { rollDicesHandler } from './handlers/board.handlers';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
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
let moveId = 0;

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
  //   const meanField = fields.find(v => v.fieldPosition === meanPosition);

  // TODO remove on multiplayer
  type.push(rollDicesHandler(null));

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
      id: moveId++,
      events,
      boardStatus: {
        players,
      },
    },
  };
};