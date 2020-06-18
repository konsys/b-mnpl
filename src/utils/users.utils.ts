import {
  playersStore,
  setPlayersEvent,
  bankStore,
} from 'src/stores/players.store';
import { IPlayer, OutcomeMessageType } from 'src/types/board.types';
import {
  JAIL_POSITION,
  UN_JAIL_PRICE,
  JAIL_TURNS,
  BANK_PLAYER_ID,
} from './board.params';
import { nanoid } from 'nanoid';
import { setCurrentActionsEvent } from 'src/stores/actions.store';

export const getPlayerById = (userId: number): IPlayer =>
  userId === BANK_PLAYER_ID
    ? bankStore.getState()
    : playersStore.getState().players.find((v) => v.userId === userId);

export const getActingPlayer = (): IPlayer => {
  const state = playersStore.getState();
  const user =
    Array.isArray(state.players) && state.players.find((v) => v.isActing);
  return user;
};

export const getActingPlayerIndex = (): number => {
  const state = playersStore.getState();
  const index =
    Array.isArray(state.players) && state.players.findIndex((v) => v.isActing);
  return index;
};

export const getPlayerIndexById = (userId: number) => {
  const state = playersStore.getState();
  return (
    Array.isArray(state.players) &&
    state.players.findIndex((v) => v.userId === userId)
  );
};

export const updatePlayer = (player: IPlayer): boolean => {
  const playersState = playersStore.getState();
  const currentPLayerIndex = getPlayerIndexById(player.userId);

  // TODO error handler
  if (currentPLayerIndex === -1) throw Error('Not found');

  playersState.players[currentPLayerIndex] = player;

  return updateAllPLayers(playersState.players);
};

export const updateAllPLayers = (players: IPlayer[]): boolean => {
  let version = playersStore.getState().version;
  setPlayersEvent({
    version: ++version,
    players,
  });
  return true;
};

export const unjailPlayer = (newPosition?: number) => {
  const player = getActingPlayer();
  // After clicking unjail for money till show roll dices modal
  setCurrentActionsEvent({
    action: OutcomeMessageType.DO_NOTHING,
    actionId: nanoid(4),
    moveId: 1,
    userId: getActingPlayer().userId,
  });

  return updatePlayer({
    ...player,
    // if there is position then unjailed by rolling dices
    money: newPosition ? player.money : player.money - UN_JAIL_PRICE,
    meanPosition: newPosition || JAIL_POSITION,
    jailed: 0,
    unjailAttempts: 0,
  });
};

export const jailPlayer = (): boolean => {
  const player = getActingPlayer();
  return updatePlayer({
    ...player,
    jailed: JAIL_TURNS,
    unjailAttempts: 0,
    doublesRolledAsCombo: 0,
    movesLeft: 0,
    meanPosition: JAIL_POSITION,
  });
};
