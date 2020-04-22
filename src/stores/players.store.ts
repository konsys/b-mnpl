import { GameDomain } from 'src/stores/actions.store';
import { IPlayer } from 'src/types/board.types';

const PlayersDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<IPlayer[]>();

export const playersStore = PlayersDomain.store<IPlayer[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

// playersStore.watch(v =>
//   console.log('playersStoreWatch', Array.isArray(v) && v[0].moveOrder),
// );
