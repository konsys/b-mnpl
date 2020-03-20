enum ResponceCode {
  ok = 0,
  error = 1,
}

export enum BoardEventType {
  ROLL_DEICES = 'rollDices',
  CAN_BUY = 'canBuy',
}

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

interface User {
  userId: number;
  isActive: boolean;
  isBlocked: boolean;
  vip: boolean;
  registrationType: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
  players: User[];
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
