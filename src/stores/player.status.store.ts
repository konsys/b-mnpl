import { GameDomain } from 'src/stores/actions.store';
import { IPlayerStatus } from 'src/types/board.types';

const PlayersStatusDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersStatusEvent = PlayersStatusDomain.event();

export const setPlayersStatusEvent = PlayersStatusDomain.event<
  IPlayerStatus[]
>();

export const playersStatusStore = PlayersStatusDomain.store<
  IPlayerStatus[] | null
>(null)
  .on(setPlayersStatusEvent, (_, data) => data)
  .reset(resetPlayersStatusEvent);

// playersStore.watch(v => console.log('playersStore', v));
