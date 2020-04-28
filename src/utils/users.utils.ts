import { playersStore, setPlayersEvent } from 'src/stores/players.store';
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

export const getPlayerIndexById = (userId: number) => {
  const pStore = playersStore.getState();
  return pStore.findIndex(v => v.userId === userId);
};

export const updatePlayer = (player: IPlayer): boolean => {
  const playersState = playersStore.getState();
  const currentPLayerIndex = getPlayerIndexById(player.userId);

  if (currentPLayerIndex === -1) return false;

  playersState[currentPLayerIndex] = player;

  setPlayersEvent(playersState);
  return true;
};

export const updatePlayers = (players: IPlayer[]): boolean => {
  setPlayersEvent(players);
  return true;
};
