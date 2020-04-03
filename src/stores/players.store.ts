import { GameDomain } from 'src/stores/actions.store';
import { UsersEntity } from 'src/entities/users.entity';

const PlayersDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<UsersEntity[] | null>();

export const playersStore = PlayersDomain.store<UsersEntity[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

playersStore.watch(v => console.log('playersStore', v));
