import { GameDomain } from 'src/stores/actions.store';
import { getActingPlayer, updatePlayer } from 'src/utils/users.utils';

export interface IDicesStore {
  userId: number;
  _id: string;
  dices: number[];
  sum: number;
  meanPosition: number;
  isDouble: boolean;
  isTriple: boolean;
}
const DicesDomain = GameDomain.domain('DicesDomain');
export const resetDicesEvent = DicesDomain.event();

export const setDicesEvent = DicesDomain.event<IDicesStore | null>();

export const dicesStore = DicesDomain.store<IDicesStore>(null)
  .on(setDicesEvent, (_, data) => data)
  .reset(resetDicesEvent);

dicesStore.updates.watch(v => {
  const player = getActingPlayer();
  v && v.isDouble && updatePlayer({ ...player, movesLeft: ++player.movesLeft });
});
