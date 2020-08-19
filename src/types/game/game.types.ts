import { IPlayer } from '../board/board.types';

export enum SocketActions {
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
}

export interface IChatMessage {
  fromUser: IPlayer;
  toUser?: IPlayer;
  message: string;
  time: Date;
}
