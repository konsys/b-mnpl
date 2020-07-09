import { GameDomain } from 'src/stores/actions.store';
import { IPlayer } from 'src/types/Board/board.types';
import { BOARD_PARAMS } from 'src/params/board.params';

const PlayersDomain = GameDomain.domain('PlayersDomain');

export interface IPlayersStore {
  version: number;
  players: IPlayer[];
}

export const resetBankEvent = PlayersDomain.event();
export const setBankEvent = PlayersDomain.event<IPlayer>();
export const bankStore = PlayersDomain.store<IPlayer>({
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 100000,
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
})
  .on(setBankEvent, (_, data) => data)
  .reset(resetBankEvent);

export const resetPlayersEvent = PlayersDomain.event();
export const setPlayersEvent = PlayersDomain.event<IPlayersStore>();
export const playersStore = PlayersDomain.store<IPlayersStore>({
  version: 0,
  players: [],
})
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

// playersStore.updates.watch((v) => {
//   const r =
//     v.players &&
//     v.players.length &&
//     v.players.find((v) => v.userId !==BOARD_PARAMS.BANK_PLAYER_ID);
//   console.log('playersStoreWatch', r && r.money);
// });
