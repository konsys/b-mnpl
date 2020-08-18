export enum SocketActions {
  BOARD_MESSAGE = 'boardMessage',
  ERROR_MESSAGE = 'errorMessage',
}

export interface IChatMessage {
  vip: boolean;
  toVip: boolean;
  name: string;
  toName: string;
  message: string;
  time: Date;
}
