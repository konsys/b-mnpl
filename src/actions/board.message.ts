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
import {
  rollDicesHandler,
  dicesModalHandler,
  canBuyModal,
} from './handlers/board.handlers';
import { playersStore } from 'src/stores/players.store';

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

let moveId = 0;

export const boardMessage = (): BoardMessage => {
  // console.log(111111, sum, meanPosition, dice1, dice2, dice3);
  let events: BoardActionTypes = null;
  type = [];

  type.push(dicesModalHandler());
  type.push(rollDicesHandler());
  type.push(canBuyModal());

  events = {
    type,
  };

  let players = [];
  playersStore.watch(v => {
    players = v;
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
