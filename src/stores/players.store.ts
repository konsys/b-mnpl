import { GameDomain } from 'src/stores/board.action.store';
import { IPlayerStatus } from 'src/types/board.types';

const PlayersDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<IPlayerStatus[] | null>();

export const playersStore = PlayersDomain.store<IPlayerStatus[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);
