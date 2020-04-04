import { GameDomain } from 'src/stores/actions.store';
import { UsersEntity } from 'src/entities/users.entity';

export interface IPlayer extends UsersEntity {
  isActing?: boolean;
}

const PlayersDomain = GameDomain.domain('PlayersDomain');
export const resetPlayersEvent = PlayersDomain.event();

export const setPlayersEvent = PlayersDomain.event<IPlayer[] | null>();

export const playersStore = PlayersDomain.store<IPlayer[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);

playersStore.watch(v => console.log('playersStore', v));
