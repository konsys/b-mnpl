import { IField, IPlayer, ResponceCode } from '../board/board.types';

export enum SocketActions {
  GAME_CHAT_MESSAGE = 'gameChatMessage',
  ROOMS_MESSAGE = 'roomsMessage',
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
}

export interface IReturnCode {
  code: number;
}

export enum IGameMessageType {
  CHAT = 'chat',
}
export interface IGameSocketMessage {
  code: ResponceCode;
  chatMessages: IChatMessage[];
}

export interface IResponceCode {
  code: number;
  message?: string;
}

export interface IChatMessage {
  fromUser: IPlayer;
  replies: any[];
  message: string;
  time: Date;
}

export enum RoomPortalFieldType {
  PORTAL = 'Portal',
  NOP = 'Empty field',
  ROULETTE = 'Roulette',
  RUSSIAN_ROULETTE = 'Russian roulette',
}

export interface IRoomResponce {
  playersInRooms: number;
  rooms: IRoomState[];
}

export interface RoomPlayer extends IPlayer {
  playerRoomStatus: PlayerRoomStatus;
}

export interface IRoomState {
  roomId: string;
  creatorId: number;
  winner: RoomPlayer | null;
  players: RoomPlayer[];
  createTime: Date;
  roomType: RoomType;
  playersNumber: number;
  autostart: boolean;
  privateRoom: boolean;
  restarts: boolean;
  portalType: RoomPortalFieldType;
  roomStatus: RoomStatus;
}

export enum RoomType {
  REGULAR = 'regular',
  RETRO = 'retro',
  SHUFFLE = 'shuffle',
  QUICK = 'quick',
  ROULETTE = 'roulette',
}

export enum RoomStatus {
  NOT_CREATED = 'notCreated',
  PENDING = 'pending',
  PLAYING = 'playing',
}

export enum PlayerRoomStatus {
  ACITVE = 'active',
  SURRENDERED = 'surrendered',
}

export interface IPlayerRoom {
  roomId: string;
  userId: number;
}

export interface IBoardParams {
  players: IPlayer[];
}

export interface IInventory {
  fields: IField[];
  inventoryQuantity: number;
}

export enum InventoryType {
  CARDS = 'cards',
  CASES = 'cases',
  DICES = 'dices',
  BADGES = 'badges',
  STICKERS = 'stickers',
  OTHERS = 'others',
}

export interface IInventoryItems {
  inventoryId: number;
  inventoryType: InventoryType;
  gameId: string;
  date: Date;
  quantity: number;
}

export interface IUserCreds {
  email?: string;
  name?: string;
  password?: string;
  userId?: number;
}

export interface IRegistrationCodeValid {
  code: string;
  validUntill: number;
}

export interface IVkToken {
  access_token: string;
  expires_in: number;
  user_id: number;
  email?: string;
}

export interface IVkUserResponce {
  id: number;
  email?: string;
  sex: number;
  bdate: string;
  photo_100: string;
  last_name: string;
  first_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
}
