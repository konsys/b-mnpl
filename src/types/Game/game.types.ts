export interface IGameModel {
  gameId: string;
}

export enum SocketActions {
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
}