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

export enum BoardActionType {
  ROLL_DICES = 'rollDices',
  CAN_BUY = 'canBuy',
  AUCTION_ACCEPT = 'auctionAccept',
  AUCTION_DECLINE = 'auctionDeclne',
  BUY = 'buy',
  PAY_RENT_SUCCESS = 'payRentSuccess',
  PAY_RENT_FAIL = 'payRentFail',
  LEVEL_UP = 'levelUp',
  LEVEL_DOWN = 'levelDown',
  CONTRACT_ACCEPTED = 'contractAccepted',
  MORTGAGE = 'mortgage',
  SHOW_MODAL = 'showModal',
  HIDE_MODAL = 'hideModal',
}

export enum BoardModalTypes {
  ROLL_DICES = 'rollDices',
  AUCTION_ACCEPT = 'auctionAccept',
  AUCTION_DECLINE = 'auctionDeclne',
  BUY = 'buy',
}

export interface BoardAction {
  type: BoardActionType;
  userId: number;
  _id: string;
}

export interface Motrgage extends BoardAction {
  type: BoardActionType.MORTGAGE;
  field: number;
}

export interface AuctionDecline extends BoardAction {
  type: BoardActionType.AUCTION_DECLINE;
}
export interface AuctionAccept extends BoardAction {
  type: BoardActionType.AUCTION_ACCEPT;
  bet: number;
}
export interface LevelUp extends BoardAction {
  type: BoardActionType.LEVEL_UP;
  field: number;
}
export interface LevelDown extends BoardAction {
  type: BoardActionType.LEVEL_DOWN;
  field: number;
}
export interface PayRentSuccess extends BoardAction {
  type: BoardActionType.PAY_RENT_SUCCESS;
  field: number;
  money: number;
  toUserId: number;
}

export interface PayRentFail extends BoardAction {
  type: BoardActionType.PAY_RENT_FAIL;
  field: number;
  money: number;
  toUserId: number;
}

export interface ShowModal extends BoardAction {
  type: BoardActionType.SHOW_MODAL;
  userId: number;
  title: string;
  text: string;
}

export interface TypeBuy extends BoardAction {
  type: BoardActionType.BUY;
  field: number;
  money: number;
}

export interface RollDices extends BoardAction {
  type: BoardActionType.ROLL_DICES;
  dices: number[];
  meanPosition: number;
}

export interface CanBuy extends BoardAction {
  type: BoardActionType.CAN_BUY;
  field: number;
  money: number;
}

export type BoardActionTypes = {
  type: Array<
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
  >;
};

interface BoardEventData {
  id: number;
  events: BoardActionTypes;
  boardStatus: BoardStatus;
  contract?: Contract;
}

export interface IPlayerStatus {
  player: UsersEntity;
  // TODO Remove ? after events completed
  gameStatus?: UserGameStatus;
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
  currentMove: CurrentMove;
}

interface BoardStatus {
  players: UsersEntity[];
  // TODO Remove ? after events completed
  moveStatus?: MoveStatus;
  fields?: BoardFIeld[];
  timers?: BoardTimers;
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
