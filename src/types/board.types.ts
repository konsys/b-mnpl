import { UsersEntity } from 'src/entities/users.entity';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

enum ResponceCode {
  ok = 0,
  error = 1,
}
export interface IActionId {
  actionId: string;
}

export interface IPlayerMove extends IActionId {
  userId: number;
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
  PLAYER_ROLL_DICES = 'playerRollDices',
  CAN_BUY = 'canBuy',
  AUCTION_START = 'auctionStart',
  BUY = 'buy',
  TAX_PAYING_MODAL = 'taxPayingModal',
  TAX_PAID = 'taxPaid',
  ROLL_DICES_MODAL = 'rollDicesModal',
  UN_JAIL_MODAL = 'unJailModal',
  UN_JAIL_PAID = 'unJailPaid',
}

export interface BoardAction {
  type: BoardActionType;
  userId: number;
  _id: string;
}

export interface AuctionStart extends BoardAction {
  type: BoardActionType.AUCTION_START;
  field: BoardFieldsEntity;
}
export interface PayRentStart extends BoardAction {
  type: BoardActionType.TAX_PAYING_MODAL;
  field: BoardFieldsEntity;
  money: number;
  toUserId: number;
  title: string;
  text: string;
}

export interface DicesModal extends BoardAction {
  type: BoardActionType.ROLL_DICES_MODAL;
  title: string;
  text: string;
}

export interface UnJailModal extends BoardAction {
  type: BoardActionType.UN_JAIL_MODAL;
  title: string;
  text: string;
}

export interface RollDices extends BoardAction {
  type: BoardActionType.PLAYER_ROLL_DICES;
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
  action: RollDices | CanBuyModal | DicesModal | PayRentStart | UnJailModal;
}

interface BoardEventData {
  id: number;
  event: IBoardEvent;
  boardStatus: BoardStatus;
  contract?: Contract;
}

export interface IPlayer extends UsersEntity {
  isActing: boolean;
  gameId: string;
  doublesRolledAsCombo: number;
  jailed: number;
  unjailAttempts: number;
  justUnailed: boolean;
  prevPosition: number;
  meanPosition: number;
  money: number;
  creditPayRound: boolean;
  creditNextTakeRound: number;
  score: number;
  additionalTime: number;
  timeReduceLevel: number;
  creditToPay: number;
  canUseCredit: boolean;
  moveOrder: number;
  isAlive: boolean;
  movesLeft: number;
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
  fields: IFieldStatus[];
  timers?: BoardTimers;
}

export interface IFieldStatus {
  fieldId: number;
  userId: number;
  level: number;
  mortgaged: boolean;
  updatedPrice: number;
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

export interface IField extends BoardFieldsEntity {
  owner?: IFieldStatus;
}

export interface IPaymentTransaction {
  sum: number | null;
  userId: number;
  toUserId: number;
}

export enum FieldType {
  CHANCE = 'chance',
  COMPANY = 'company',
  JAIL = 'jail',
  ROULETTE = 'roulette',
  CASINO = 'casino',
  START = 'start',
  TAX = 'tax',
  IT = 'IT',
  AUTO = 'auto',
  TAKE_REST = 'takeRest',
}
