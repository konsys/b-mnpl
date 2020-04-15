import { UsersEntity } from 'src/entities/users.entity';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

enum ResponceCode {
  ok = 0,
  error = 1,
}
export interface IActionId {
  actionId: string;
}

export type Contract = {
  fromUserId: number;
  toUserId: number;
  outFields: number[];
  outMoney: number;
  inFields: number[];
  inMoney: number;
  _id: string;
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
  SHOW_DICES_MODAL = 'showDicesModal',
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
  field: BoardFieldsEntity;
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
  field: BoardFieldsEntity;
}
export interface LevelDown extends BoardAction {
  type: BoardActionType.LEVEL_DOWN;
  field: BoardFieldsEntity;
}
export interface PayRentSuccess extends BoardAction {
  type: BoardActionType.PAY_RENT_SUCCESS;
  field: BoardFieldsEntity;
  money: number;
  toUserId: number;
}

export interface PayRentFail extends BoardAction {
  type: BoardActionType.PAY_RENT_FAIL;
  field: BoardFieldsEntity;
  money: number;
  toUserId: number;
}

export interface DicesModal extends BoardAction {
  type: BoardActionType.SHOW_DICES_MODAL;
  userId: number;
  title: string;
  text: string;
}

export interface RollDices extends BoardAction {
  type: BoardActionType.ROLL_DICES;
  dices: number[];
  isDouble: boolean;
  isTriple: boolean;
  meanPosition: number;
}

export interface CanBuyModal extends BoardAction {
  type: BoardActionType.CAN_BUY;
  field: BoardFieldsEntity;
  money: number;
  title: string;
  text: string;
}

export interface IBoardEvent {
  action:
    | Motrgage
    | AuctionDecline
    | AuctionAccept
    | LevelUp
    | LevelDown
    | PayRentSuccess
    | PayRentFail
    | RollDices
    | CanBuyModal
    | DicesModal;
}

interface BoardEventData {
  id: number;
  event: IBoardEvent;
  boardStatus: BoardStatus;
  contract?: Contract;
}

export interface IPlayerStatus extends UsersEntity {
  isActing: boolean;
  gameId: string;
  doublesRolledAsCombo: number;
  jailed: boolean;
  unjailAttempts: number;
  meanPosition: number;
  money: number;
  creditPayRound: boolean;
  creditNextTakeRound: number;
  score: number;
  frags: string;
  additionalTime: number;
  timeReduceLevel: number;
  creditToPay: number;
  canUseCredit: boolean;
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
  moveId: number;
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

export interface HandleMessage {
  code: ResponceCode;
  data: BoardEventData;
}
