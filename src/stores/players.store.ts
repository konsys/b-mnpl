import { GameDomain } from 'src/stores/actions.store';
import { IPlayer } from 'src/types/board.types';

const PlayersDomain = GameDomain.domain('PlayersDomain');

export interface IPlayersStore {
  version: number;
  players: IPlayer[];
}

export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<IPlayersStore>();

export const playersStore = PlayersDomain.store<IPlayersStore>({
  version: 0,
  players: [],
})
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

// playersStore.watch((v) => {
//   console.log('playersStoreWatch', v);
// });
