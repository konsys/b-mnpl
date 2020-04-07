import { GameDomain } from 'src/stores/actions.store';
import nanoid from 'nanoid';

export interface IMoveStore {
  gameId: string;
  moveId: number;
}

const MoveDomain = GameDomain.domain('MoveDomain');
export const resetMoveEvent = MoveDomain.event();

export const incrementMoveEvent = MoveDomain.event<void>();

export const moveStore = MoveDomain.store<IMoveStore>({
  gameId: nanoid(8),
  moveId: 1,
})
  .on(incrementMoveEvent, prev => ({
    ...prev,
    moveId: prev.moveId += 1,
  }))
  .reset(resetMoveEvent);

// moveStore.watch(v => console.log('moveStore', v));
