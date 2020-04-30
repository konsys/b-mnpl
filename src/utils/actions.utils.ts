import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { BoardActionType } from 'src/types/board.types';
import nanoid from 'nanoid';
import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { getFieldIndex, findFieldByPosition } from './fields.utis.';
import {
  getActingPlayer,
  getActingPlayerIndex,
  updateAllPLayers,
  updatePlayer,
} from './users.utils';
import { playersStore } from 'src/stores/players.store';

export const buyFieldModalAction = (): void => {
  const player = getActingPlayer();
  const action = actionsStore.getState();
  setCurrentActionsEvent({
    action: BoardActionType.CAN_BUY,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'buyFieldModalAction',
  });
};

export const buyFieldAction = (): void => {
  // Field set to player
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  const fieldIndex = getFieldIndex(field);
  const fields = fieldsStore.getState();
  field.price = Math.floor(field.price / 110) * 10;
  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: field.price,
  };

  fields[fieldIndex] = field;
  setFieldsEvent(fields);

  // Decrease player`s money
  const players = playersStore.getState();
  const playerIndex = players.findIndex(v => v.userId === user.userId);
  players[playerIndex] = { ...user, money: user.money - field.price };
  updateAllPLayers(players);
};

export const rollDicesModalAction = (): void => {
  const action = actionsStore.getState();
  const player = getActingPlayer();
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesModalAction',
  });
};

export const payTaxModalAction = (): void => {
  const action = actionsStore.getState();
  const player = getActingPlayer();
  setCurrentActionsEvent({
    action: BoardActionType.TAX_PAYING_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'payTaxModalAction',
  });
};

export const rollDicesAction = (): void => {
  const action = actionsStore.getState();
  const player = getActingPlayer();
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesAction',
  });
};

export const startAuctionAction = (): void => {
  const action = actionsStore.getState();
  const player = getActingPlayer();
  setCurrentActionsEvent({
    action: BoardActionType.AUCTION_START,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'startAuctionAction',
  });
};

const getNextIndex = (index: number, array: any[]) =>
  index < array.length - 1 ? index + 1 : 0;

export const switchPlayerTurn = (): void => {
  const players = playersStore.getState();
  const index = getActingPlayerIndex();
  let player = getActingPlayer();
  let nextIndex = index;

  // Doubled dices and jail
  if (player.movesLeft > 0) {
    nextIndex = index;
    player.movesLeft = --player.movesLeft;
    player.doublesRolledAsCombo = ++player.doublesRolledAsCombo;
    if (player.doublesRolledAsCombo >= 3) {
      player.doublesRolledAsCombo = 0;
      player.jailed = 3;
      nextIndex = getNextIndex(index, players);
    }
    updatePlayer(player);
  } else {
    nextIndex = getNextIndex(index, players);
  }

  const res = players.map((v, k) => {
    if (k === nextIndex) {
      return { ...v, isActing: true };
    } else {
      return { ...v, isActing: false };
    }
  });
  updateAllPLayers(res);
};
