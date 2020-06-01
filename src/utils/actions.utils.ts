import { actionsStore, updateAction } from 'src/stores/actions.store';
import { FieldType, OutcomeMessageType } from 'src/types/board.types';
import nanoid from 'nanoid';
import { findFieldByPosition, buyAuto, buyCompany } from './fields.utils';
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
  updateAction({
    action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    isCompleted: false,
    moveId: action.moveId + 1,
    srcOfChange: 'buyFieldModalAction',
  });
};

export const buyFieldAction = (): void => {
  // Field set to player
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  let price = field.price;

  if (field.type === FieldType.AUTO) {
    price = buyAuto(field);
  } else if (field.type === FieldType.COMPANY) {
    price = buyCompany(field);
  }

  // Decrease player`s money
  const players = playersStore.getState().players;
  const playerIndex = players.findIndex(v => v.userId === user.userId);
  players[playerIndex] = { ...user, money: user.money - price };
  updateAllPLayers(players);
};

export const unJailModalAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    isCompleted: false,
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'unJailModalAction',
  });
};

export const payTaxModalAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    isCompleted: false,
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'payTaxModalAction',
  });
};

export const rollDicesAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    isCompleted: false,
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'rollDicesAction',
  });
};

export const startAuctionAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    isCompleted: false,
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
    // console.log(1, player.name);
    nextIndex = index;
    player.movesLeft = --player.movesLeft;
    updatePlayer(player);
  } else {
    // console.log(2, player.name);
    nextIndex = getNextArrayIndex(index, players);
  }

  const res = players.map((v, k) => {
    if (k === nextIndex) {
      if (unJail) {
        v.jailed = 0;
        v.unjailAttempts = 0;
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

export const rollDicesModalAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    isCompleted: false,
    moveId: actionsStore.getState().moveId + 1,
    srcOfChange: 'rollDicesModalAction',
  });
};

export const calcPercentPart = (price: number, percent: number) =>
  Math.floor((price / 1000) * percent) * 10;
