import { IPlayer, ResponceCode } from '../board/board.types';

export enum SocketActions {
  GAME_CHAT_MESSAGE = 'gameChatMessage',
  ROOMS_MESSAGE = 'roomsMessage',
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
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
  COMPLETED = 'completed',
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
