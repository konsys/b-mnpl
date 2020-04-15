import { GameDomain } from 'src/stores/actions.store';
import { IPlayerStatus } from 'src/types/board.types';

const PlayersDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<IPlayerStatus[]>();

export const playersStore = PlayersDomain.store<IPlayerStatus[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

// playersStore.watch(v => console.log('playersStoreWatch', v));
