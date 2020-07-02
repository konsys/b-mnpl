import { actionsStore, updateAction } from 'src/stores/actions.store';
import { OutcomeMessageType } from 'src/types/Board/board.types';
import { nanoid } from 'nanoid';
import {
  findFieldByPosition,
  buyCompany,
  buyITCompany,
  mortgage,
} from './fields.utils';
import {
  getActingPlayer,
  getActingPlayerIndex,
  updateAllPLayers,
  updatePlayer,
} from './users.utils';
import { playersStore } from 'src/stores/players.store';
import { FieldType } from 'src/entities/board.fields.entity';
import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
import { BOARD_PARAMS } from '../params/board.params';

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
  let sum = field.price.startPrice;

  if (field.type === FieldType.AUTO || field.type === FieldType.COMPANY) {
    sum = buyCompany(field);
  } else if (field.type === FieldType.IT) {
    sum = buyITCompany(field);
  }
  // Decrease player`s money;
  const transactionId = nanoid(4);
  setTransactionEvent({
    sum,
    reason: `Купить ${field.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: user.userId,
  });
  transactMoneyEvent(transactionId);
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

const getNextArrayIndex = (index: number, array: any[]) =>
  index < array.length - 1 ? index + 1 : 0;
