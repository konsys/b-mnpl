import { playersStore } from 'src/stores/players.store';
import { IPlayer } from 'src/types/board.types';

export const getActingPlayer = (): IPlayer => {
  const state = playersStore.getState();
  const user = state && state.find(v => v.isActing);
  return user;
};
export const getActingPlayerIndex = (): number => {
  const state = playersStore.getState();
  const index = state && state.findIndex(v => v.isActing);
  return index;
};
