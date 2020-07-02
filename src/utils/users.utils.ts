import {
  playersStore,
  setPlayersEvent,
  bankStore,
  setBankEvent,
} from 'src/stores/players.store';
import { IPlayer, OutcomeMessageType } from 'src/types/Board/board.types';
import { BOARD_PARAMS } from '../params/board.params';
import { nanoid } from 'nanoid';
import { setCurrentActionsEvent } from 'src/stores/actions.store';

export const getPlayerById = (userId: number): IPlayer =>
  userId === BOARD_PARAMS.BANK_PLAYER_ID
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

export const getPlayerMoneyById = (userId: number): number => {
  const state = playersStore.getState().players;
  const player = Array.isArray(state) && state.find((v) => v.userId === userId);
  return (player && player.money) || 0;
};

export const updatePlayer = (player: IPlayer): boolean => {
  // Update BANK
  if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
    return (
      setBankEvent({
        ...player,
      }) && true
    );
  }

  const playersState = playersStore.getState();
  const currentPLayerIndex = getPlayerIndexById(player.userId);

  // TODO error handler
  if (currentPLayerIndex === -1)
    throw Error(`Not found player with id: ${player.userId}`);

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
    money: newPosition
      ? player.money
      : player.money - BOARD_PARAMS.UN_JAIL_PRICE,
    meanPosition: newPosition || BOARD_PARAMS.JAIL_POSITION,
    jailed: 0,
    unjailAttempts: 0,
  });
};

export const jailPlayer = (): boolean => {
  const player = getActingPlayer();
  return updatePlayer({
    ...player,
    jailed: BOARD_PARAMS.JAIL_TURNS,
    unjailAttempts: 0,
    doublesRolledAsCombo: 0,
    movesLeft: 0,
    meanPosition: BOARD_PARAMS.JAIL_POSITION,
  });
};
