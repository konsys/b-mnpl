import { IPlayer } from 'src/types/Board/board.types';
import { BOARD_PARAMS } from 'src/params/board.params';
import { redis } from 'src/main';

export interface IPlayersStore {
  version: number;
  players: IPlayer[];
}

export const setPlayersStore = async (gameId: string, players: IPlayersStore) =>
  await redis.set(`${gameId}-players`, JSON.stringify(players));

export const getPlayersStore = async (gameId: string): Promise<IPlayersStore> =>
  JSON.parse(await redis.get(`${gameId}-players`)) as IPlayersStore;

const bank: IPlayer = {
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 100000,
  password: 'bank',
  vip: true,
  registrationType: 'none',
  name: 'BANK',
  email: 'b@b.ru',
  team: null,
  avatar: '',
  createdAt: new Date('2020-06-17T12:08:38.000Z'),
  updatedAt: new Date('2020-06-17T12:08:38.000Z'),
  isActive: false,
  isBlocked: true,
  isActing: false,
  gameId: '',
  doublesRolledAsCombo: 0,
  jailed: 0,
  unjailAttempts: 0,
  meanPosition: 0,
  creditPayRound: false,
  creditNextTakeRound: 0,
  score: 0,
  additionalTime: 0,
  timeReduceLevel: 0,
  creditToPay: 0,
  canUseCredit: false,
  moveOrder: 0,
  isAlive: false,
  movesLeft: 0,
};

export const setBankStore = async (gameId: string, player: IPlayer) =>
  await redis.set(gameId, JSON.stringify(player));

export const getBankStore = async (gameId: string): Promise<IPlayer> =>
  JSON.parse(await redis.get(gameId));

setBankStore('bankStore', bank);
