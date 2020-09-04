import { IPlayer, ResponceCode } from '../board/board.types';

export enum SocketActions {
  GAME_MESSAGE = 'gameMessage',
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
}

export interface IGameSocketMessage {
  code: ResponceCode;
  data: { text: string };
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
export interface IRoomState {
  roomId: string;
  creatorId: number;
  players: IPlayer[];
  createTime: Date;
  roomType: IRoomType;
  playersNumber: number;
  autostart: boolean;
  privateRoom: boolean;
  restarts: boolean;
  portalType: RoomPortalFieldType;
}

export enum IRoomType {
  REGULAR = 'regular',
  RETRO = 'retro',
  SHUFFLE = 'shuffle',
  QUICK = 'quick',
  ROULETTE = 'roulette',
}
export interface IAddPlayerToRoom {
  roomId: string;
  userId: number;
}
