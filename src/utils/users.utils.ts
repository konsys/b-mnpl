import { playersStore, setPlayersEvent } from 'src/stores/players.store';
import { IPlayer } from 'src/types/board.types';

export const getPlayerById = (userId: number): IPlayer => {
  return playersStore.getState().find(v => v.userId === userId);
};

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

  // TODO error handler
  if (currentPLayerIndex === -1) throw Error('Not found');

  playersState[currentPLayerIndex] = player;

  console.log(1111111, player);
  return updateAllPLayers(playersState);
};

export const updateAllPLayers = (players: IPlayer[]): boolean => {
  setPlayersEvent(players);
  return true;
};

export const userChance = (sum: number): boolean => {
  const player = getActingPlayer();
  return updatePlayer({
    ...player,
    money: player.money + (sum > 0 ? sum : -sum),
  });
};

export const moneyTransaction = (
  sum: number,
  userId1: number,
  userId2: number,
): boolean => {
  const player1 = getPlayerById(userId1);
  const player2 = getPlayerById(userId2);
  // TODO error handler
  if (player1.money < sum) throw Error('No money');

  return !player2
    ? updatePlayer({ ...player1, money: player1.money + sum })
    : updatePlayer({ ...player1, money: player1.money + sum }) &&
        updatePlayer({ ...player2, money: player2.money - sum });
};
