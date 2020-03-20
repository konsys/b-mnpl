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

interface Player {
  userId: number;
  status: number;
  vip: boolean;
  doublesRolledAsCombo: number;
  jailed: boolean;
  unjailAttempts: number;
  position: number;
  money: number;
  canUseCredit: boolean;
  creditPayRound: boolean;
  creditToPay: number;
  creditNextTakeRound: number;
  score: number;
  frags: number[];
  additionalTime: number;
  timeReduceLevel: number;
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
  players: Player[];
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
