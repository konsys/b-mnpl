import { GameDomain } from 'src/stores/actions.store';

export interface IDicesStore {
  userId: number;
  moveId: number;
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

dicesStore.watch(v => console.log('dicesStore', v));
