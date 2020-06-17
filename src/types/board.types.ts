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

export enum IncomeMessageType {
  INCOME_TOKEN_TRANSITION_COMPLETED = 'changeTokenPositionCompleted',
  INCOME_AUCTION_START_CLICKED = 'auctionStartClicked',
  INCOME_BUY_FIELD_CLICKED = 'buyFieldClicked',
  INCOME_TAX_PAID_CLICKED = 'taxPaidCLicked',
  INCOME_UN_JAIL_PAID_CLICKED = 'unJailPaidClicked',
  INCOME_ROLL_DICES_CLICKED = 'rollDicesClicked',
}

export enum OutcomeMessageType {
  DO_NOTHING = 'doNothing',
  OUTCOME_PLAYER_TOKEN_POSITION_ACTION = 'changeTokenAction',
  OUTCOME_CAN_BUY_MODAL = 'canBuyModal',
  OUTCOME_TAX_PAYING_MODAL = 'taxPayingModal',
  OUTCOME_UNJAIL_PAYING_MODAL = 'unjailPayingModal',
  OUTCOME_ROLL_DICES_MODAL = 'rollDicesModal',
  OUTCOME_UN_JAIL_MODAL = 'unJailModal',
  OUTCOME_AUCTION_MODAL = 'auctionModal',
  OUTCOME_ROLL_DICES_ACTION = 'rollDicesAction',
}

export interface IBoardAction {
  type: IncomeMessageType | OutcomeMessageType;
  userId: number;
  _id: string;
}

export interface IIncomeBoardAction {
  type: IncomeMessageType;
  userId: number;
  _id: string;
}

export interface IOutcameBoardAction {
  type: OutcomeMessageType;
  userId: number;
  isModal: boolean;
  _id: string;
}

export interface IAuctionStart extends IIncomeBoardAction {
  type: IncomeMessageType.INCOME_AUCTION_START_CLICKED;
  field: BoardFieldsEntity;
}

export interface IPayRentModal extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL;
  field: BoardFieldsEntity;
  money: number;
  toUserId: number;
  title: string;
  text: string;
}

export interface IDicesModal extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL;
  title: string;
  text: string;
}

export interface IUnJailModal extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL;
  title: string;
  text: string;
}

export interface IUnJailPayingModal extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL;
  title: string;
  text: string;
  money: number;
}

export interface IRollDicesMessage extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION;
  dices: number[];
  isDouble: boolean;
  isTriple: boolean;
  meanPosition: number | 'jail';
}

export interface IShowCanBuyModal extends IOutcameBoardAction {
  type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL;
  field: BoardFieldsEntity;
  money: number;
  title: string;
  text: string;
}

export interface IDoNothing extends IOutcameBoardAction {
  type: OutcomeMessageType.DO_NOTHING;
}
export interface IBoardEvent {
  action:
    | IDicesModal
    | IShowCanBuyModal
    | IDicesModal
    | IPayRentModal
    | IUnJailModal
    | IUnJailPayingModal
    | IRollDicesMessage
    | IDoNothing;
}

interface IBoardEventData {
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
  paymentMultiplier: number;
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
  data: IBoardEventData;
}

export interface IField extends BoardFieldsEntity {
  owner?: IFieldStatus;
}

export interface IMoneyTransaction {
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
