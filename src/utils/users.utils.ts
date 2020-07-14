import {
  getPlayersStore,
  setPlayersStore,
  getBankStore,
  setBankStore,
} from 'src/stores/players.store';
import { IPlayer, OutcomeMessageType } from 'src/types/Board/board.types';
import { BOARD_PARAMS } from '../params/board.params';
import { nanoid } from 'nanoid';
import { setCurrentActionsEvent } from 'src/stores/actions.store';
import { NotFoundException } from '@nestjs/common';

export const getPlayerById = async (
  gameId: string,
  userId: number,
): Promise<IPlayer> => {
  const bank = await getBankStore(gameId);
  const players = await getPlayersStore(gameId);
  return userId === BOARD_PARAMS.BANK_PLAYER_ID
    ? bank
    : players.players.find((v) => v.userId === userId);
};

export const getActingPlayer = async (gameId: string): Promise<IPlayer> => {
  const state = await getBankStore(gameId);
  const user = Array.isArray(state) && state.find((v) => v.isActing);
  return user;
};

export const getActingPlayerIndex = async (gameId: string): Promise<number> => {
  const state = await getBankStore(gameId);
  const index = Array.isArray(state) && state.findIndex((v) => v.isActing);
  return index;
};

export const getPlayerIndexById = async (gameId: string, userId: number) => {
  const state = await getBankStore(gameId);
  return Array.isArray(state) && state.findIndex((v) => v.userId === userId);
};

export const getPlayerMoneyById = async (
  gameId: string,
  userId: number,
): Promise<number> => {
  const state = await getBankStore(gameId);
  const player = Array.isArray(state) && state.find((v) => v.userId === userId);
  return (player && player.money) || 0;
};

export const unjailPlayer = async (gameId: string, newPosition?: number) => {
  const player = await getActingPlayer(gameId);
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

export const jailPlayer = async (gameId: string): Promise<boolean> => {
  const player = getActingPlayer(gameId);
  return await updatePlayer(gameId, {
    ...player,
    jailed: BOARD_PARAMS.JAIL_TURNS,
    unjailAttempts: 0,
    doublesRolledAsCombo: 0,
    movesLeft: 0,
    meanPosition: BOARD_PARAMS.JAIL_POSITION,
  });
};

export const updatePlayer = async (
  gameId: string,
  player: IPlayer,
): Promise<boolean> => {
  // Update BANK
  if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
    return (
      setBankStore(gameId, {
        player,
      }) && true
    );
  }

  const playersState = await getBankStore(gameId);
  const currentPLayerIndex = getPlayerIndexById(gameId, player.userId);

  // TODO error handler
  if (currentPLayerIndex === -1)
    throw Error(`Not found player with id: ${player.userId}`);

  playersState[currentPLayerIndex] = player;

  return updateAllPLayers(gameId, playersState);
};

export const updateAllPLayers = async (
  gameId: string,
  players: IPlayer[],
): Promise<boolean> => {
  let state = await getPlayersStore(gameId);
  setPlayersStore(gameId, { players, version: ++state.version });
  return true;
};
