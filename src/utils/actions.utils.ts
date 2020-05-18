import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { BoardActionType, FieldType } from 'src/types/board.types';
import nanoid from 'nanoid';
import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import {
  getFieldIndex,
  findFieldByPosition,
  updateAllFields,
  buyAuto,
} from './fields.utis.';
import {
  getActingPlayer,
  getActingPlayerIndex,
  updateAllPLayers,
  updatePlayer,
} from './users.utils';
import { playersStore } from 'src/stores/players.store';
import {
  ONE_FIELD_PERCENT,
  ONE_AUTO_PERCENT,
  FOUR_AUTO_PERCENT,
  FREE_AUTO_PERCENT,
  TWO_AUTO_PERCENT,
} from './board.params.util';

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
  const fieldsState = fieldsStore.getState().fields;
  let price = field.price;

  if (field.type === FieldType.AUTO) {
    price = buyAuto(field);
  } else {
    price = getPercentPart(price, ONE_FIELD_PERCENT);
    field.owner = {
      fieldId: field.fieldId,
      userId: user.userId,
      level: 0,
      mortgaged: false,
      updatedPrice: price,
    };
    fieldsState[fieldIndex] = field;

    updateAllFields(fieldsState);
  }

  // Decrease player`s money
  const players = playersStore.getState().players;
  const playerIndex = players.findIndex(v => v.userId === user.userId);
  players[playerIndex] = { ...user, money: user.money - price };
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

export const getNextArrayIndex = (index: number, array: any[]) =>
  index < array.length - 1 ? index + 1 : 0;

export const switchPlayerTurn = (unJail: boolean = false): void => {
  const players = playersStore.getState().players;
  const index = getActingPlayerIndex();
  let player = getActingPlayer();
  let nextIndex = index;

  // Doubled dices and jail
  if (player.movesLeft > 0) {
    nextIndex = index;
    player.movesLeft = --player.movesLeft;
    updatePlayer(player);
  } else if (!unJail) {
    nextIndex = getNextArrayIndex(index, players);
  }

  const res = players.map((v, k) => {
    if (k === nextIndex) {
      if (unJail) {
        v.jailed = 0;
      }
      return { ...v, isActing: true };
    } else {
      return { ...v, isActing: false };
    }
  });

  updateAllPLayers(res);
  player = getActingPlayer();
  player.jailed ? unJailModalAction() : rollDicesModalAction();
};

export const getPercentPart = (price: number, percent: number) =>
  Math.floor((price / 1000) * percent) * 10;
