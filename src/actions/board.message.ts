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
import { moveStore } from 'src/stores/move.store';

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

export const boardMessage = (): BoardMessage => {
  const moveState = moveStore.getState();
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
      id: moveState.moveId,
      events,
      boardStatus: {
        players,
      },
    },
  };
};
