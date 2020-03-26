import { UsersEntity } from 'src/entities/users.entity';

enum ResponceCode {
  ok = 0,
  error = 1,
}

export type Contract = {
  fromUserId: number;
  toUserId: number;
  outFields: number[];
  outMoney: number;
  inFields: number[];
  inMoney: number;
  _id: 'CWRlgfKGAm4=';
};

export enum BoardEventType {
  ROLL_DICES = 'rollDices',
  CAN_BUY = 'canBuy',
  AUCTION_ACCEPT = 'auctionAccept',
  AUCTION_DECLINE = 'auctionDeclne',
  BUY = 'buy',
  PAY_RENT_SUCCESS = 'payRentSuccess',
  LEVEL_UP = 'levelUp',
  LEVEL_DOWN = 'levelDown',
  CONTRACT_ACCEPTED = 'contractAccepted',
  MORTGAGE = 'mortgage',
}
export interface BoardAction {
  type: BoardEventType;
  userId: number;
  _id: string;
}

export interface Motrgage extends BoardAction {
  type: BoardEventType.MORTGAGE;
  field: number;
}

export interface AuctionDecline extends BoardAction {
  type: BoardEventType.AUCTION_DECLINE;
}
export interface AuctionAccept extends BoardAction {
  type: BoardEventType.AUCTION_ACCEPT;
  bet: number;
}
export interface LevelUp extends BoardAction {
  type: BoardEventType.LEVEL_UP;
  field: number;
}
export interface LevelDown extends BoardAction {
  type: BoardEventType.LEVEL_DOWN;
  field: number;
}
export interface PayRentSuccess extends BoardAction {
  type: BoardEventType.PAY_RENT_SUCCESS;
  field: number;
  money: number;
  toUserId: number;
}

export interface TypeBuy extends BoardAction {
  type: BoardEventType.BUY;
  field: number;
  money: number;
}

export interface RollDices extends BoardAction {
  type: BoardEventType.ROLL_DICES;
  dices: number[];
  meanPosition: number;
}

export interface CanBuy extends BoardAction {
  type: BoardEventType.CAN_BUY;
  field: number;
  money: number;
}

interface BoardEventData {
  id: number;
  events: Array<RollDices | CanBuy>;
  // TODO Remove ? after events completed
  boardStatus?: BoardStatus;
  contract?: Contract;
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

export interface BoardMessage {
  code: ResponceCode;
  data: BoardEventData;
}
