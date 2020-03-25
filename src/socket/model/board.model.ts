import { UsersEntity } from 'src/entities/users.entity';

enum ResponceCode {
  ok = 0,
  error = 1,
}

export enum BoardEventType {
  ROLL_DEICES = 'rollDices',
  CAN_BUY = 'canBuy',
  TO_JAIL = 'toJail',
  CHANCE = 'chance',
  RUSSIAN_ROULETTE = 'russianRoulette',
  START = 'start',
  NOTHING_HAPPENED = 'nothingHappened',
  AUCTION_ACCEPT = 'auctionAccept',
  BUY = 'buy',
  PAY_RENT_SUCCESS = 'payRentSuccess',
  LEVEL_UP = 'levelUp',
}

export type EventLevelUp = {
  type: BoardEventType.LEVEL_UP;
  userId: 293123;
  field: number;
  _id: 'CWRkUJTGAZk=';
};
export type EventPayRentSuccess = {
  type: BoardEventType.PAY_RENT_SUCCESS;
  userId: number;
  field: number;
  money: number;
  toUserId: number;
  _id: 'CWRjn59GARg=';
};

export type EventTypeBuy = {
  type: BoardEventType.BUY;
  userId: number;
  field: number;
  money: number;
  _id: 'CWRjn59GARg=';
};

export type EventRollDices = {
  type: BoardEventType.ROLL_DEICES;
  userId: number;
  dices: number[];
  meanPosition: number;
  _id: string;
};

export type EventCanBuy = {
  type: BoardEventType.CAN_BUY;
  userId: number;
  field: number;
  money: number;
  _id: string;
};

interface BoardEventData {
  id: number;
  events: Array<EventRollDices | EventCanBuy>;
  status: BoardStatus;
}

export enum BoardFieldActions {
  BUY = 'buy',
  TO_AUCTION = 'toAuction',
  LEVEL_DOWN = 'levelDown',
  CONTRACT = 'contract',
  MORTGAGE = 'mortgage',
}

interface IUser {
  userData: UsersEntity;
  userGameStatus: UserGameStatus;
}

interface UserGameStatus {
  gameId: string;
  doublesRolledAsCombo: number;
  jailed: boolean;
  unjailAttempts: number;
  position: number;
  money: number;
  creditPayRound: boolean;
  creditNextTakeRound: number;
  score: number;
  frags: string;
  additionalTime: number;
  timeReduceLevel: number;
  creditToPay: number;
  canUseCredit: boolean;
  userId: number;
}

interface BoardFIeld {
  owner: number;
  level: number;
  mortgaged: boolean;
}

interface CurrentMove {
  dices: number[];
  dicesSum: number;
  isTriple: boolean;
  isDouble: boolean;
}

interface MoveStatus {
  moveId: string;
  playerOwnerOfMove: number;
  round: number;
  actionPlayer: number;
  actionType: BoardFieldActions[];
  currentMove: CurrentMove;
}

interface BoardStatus {
  players: IUser[];
  moveStatus: MoveStatus;
  fields: BoardFIeld[];
  timers: BoardTimers;
}

interface BoardTimers {
  timeoutTs: number;
  timeoutIsAdditional: boolean;
  pauseData: PauseData;
}

interface PauseData {
  isActive: boolean;
  viewers: 0;
  tsStart: number;
  tsNow: number;
  inactive: number;
}

export interface BoardSocketMessage {
  code: ResponceCode;
  data: BoardEventData;
}
