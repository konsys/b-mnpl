import { actionsStore, updateAction } from 'src/stores/actions.store';
import { FieldType, OutcomeMessageType } from 'src/types/board.types';
import nanoid from 'nanoid';
import {
  findFieldByPosition,
  buyAuto,
  buyCompany,
  buyITCompany,
} from './fields.utils';
import {
  getActingPlayer,
  getActingPlayerIndex,
  updateAllPLayers,
  updatePlayer,
  getPlayerById,
} from './users.utils';
import { playersStore } from 'src/stores/players.store';

export const buyFieldModal = (): void => {
  const player = getActingPlayer();
  const action = actionsStore.getState();
  updateAction({
    action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
  });
};

export const buyField = (): void => {
  // Field set to player
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  let price = field.price;

  if (field.type === FieldType.AUTO) {
    price = buyAuto(field);
  } else if (field.type === FieldType.COMPANY) {
    price = buyCompany(field);
  } else if (field.type === FieldType.IT) {
    price = buyITCompany(field);
  }

  // Decrease player`s money;
  updatePlayer({ ...getPlayerById(user.userId), money: user.money - price });
};

export const unJailModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payUnJailModal = (): void => {
  console.log(123123123);
  updateAction({
    action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payTaxModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const startAuctionModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
    userId: getActingPlayer().userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
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
    updatePlayer({ ...player, movesLeft: --player.movesLeft });
  } else {
    nextIndex = getNextArrayIndex(index, players);
  }

  const res = players.map((v, k) => {
    if (k === nextIndex) {
      if (unJail) {
        v.movesLeft = 0;
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
  player.jailed ? unJailModal() : rollDicesModal();
};

export const calcPercentPart = (price: number, percent: number) =>
  Math.floor((price / 1000) * percent) * 10;
