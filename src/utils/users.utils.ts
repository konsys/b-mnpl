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
import { NotFoundException } from '@nestjs/common';

export const getPlayerById = (gameId: string, userId: number): IPlayer =>
  userId === BOARD_PARAMS.BANK_PLAYER_ID
    ? bankStore.getState()
    : playersStore.getState()[gameId].find((v) => v.userId === userId);

export const getActingPlayer = (gameId: string): IPlayer => {
  const state = playersStore.getState()[gameId];
  const user = Array.isArray(state) && state.find((v) => v.isActing);
  return user;
};

export const getActingPlayerIndex = (gameId: string): number => {
  const state = playersStore.getState()[gameId];
  const index = Array.isArray(state) && state.findIndex((v) => v.isActing);
  return index;
};

export const getPlayerIndexById = (gameId: string, userId: number) => {
  const state = playersStore.getState()[gameId];
  return Array.isArray(state) && state.findIndex((v) => v.userId === userId);
};

export const getPlayerMoneyById = (gameId: string, userId: number): number => {
  const state = playersStore.getState()[gameId];
  const player = Array.isArray(state) && state.find((v) => v.userId === userId);
  return (player && player.money) || 0;
};

export const unjailPlayer = (gameId: string, newPosition?: number) => {
  const player = getActingPlayer(gameId);
  // After clicking unjail for money till show roll dices modal
  setCurrentActionsEvent({
    action: OutcomeMessageType.DO_NOTHING,
    actionId: nanoid(4),
    moveId: 1,
    userId: player.userId,
  });

  return updatePlayer(gameId, {
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

export const jailPlayer = (gameId: string): boolean => {
  const player = getActingPlayer(gameId);
  return updatePlayer(gameId, {
    ...player,
    jailed: BOARD_PARAMS.JAIL_TURNS,
    unjailAttempts: 0,
    doublesRolledAsCombo: 0,
    movesLeft: 0,
    meanPosition: BOARD_PARAMS.JAIL_POSITION,
  });
};

export const updatePlayer = (gameId: string, player: IPlayer): boolean => {
  // Update BANK
  if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
    return (
      setBankEvent({
        ...player,
      }) && true
    );
  }

  const playersState = playersStore.getState()[gameId];
  const currentPLayerIndex = getPlayerIndexById(gameId, player.userId);

  // TODO error handler
  if (currentPLayerIndex === -1)
    throw Error(`Not found player with id: ${player.userId}`);

  playersState[currentPLayerIndex] = player;

  return updateAllPLayers(gameId, playersState);
};

export const updateAllPLayers = (
  gameId: string,
  players: IPlayer[],
): boolean => {
  let state = playersStore.getState();
  setPlayersEvent({
    ...state,
    [gameId]: players,
  });
  return true;
};
const getPlayersStore = (gameId: string) => {
  const state = playersStore.getState().gameId;
  if (!state) {
    throw new NotFoundException(`Players with gameid ${gameId} not found`);
  }
  return state;
};
