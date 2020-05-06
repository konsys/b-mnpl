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
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'rollDicesModalAction',
  });
};

export const unJailModalAction = (): void => {
  console.log(2222222222222, 'unjail');
  setCurrentActionsEvent({
    action: BoardActionType.UN_JAIL_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'unJailModalAction',
  });
};

export const payTaxModalAction = (): void => {
  setCurrentActionsEvent({
    action: BoardActionType.TAX_PAYING_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'payTaxModalAction',
  });
};

export const rollDicesAction = (): void => {
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'rollDicesAction',
  });
};

export const startAuctionAction = (): void => {
  setCurrentActionsEvent({
    action: BoardActionType.AUCTION_START,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
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
    updatePlayer(player);
  } else {
    nextIndex = getNextIndex(index, players);
  }

  const res = players.map((v, k) =>
    k === nextIndex ? { ...v, isActing: true } : { ...v, isActing: false },
  );

  updateAllPLayers(res);
  player = getActingPlayer();
  !player.jailed ? rollDicesModalAction() : rollDicesModalAction();
};
