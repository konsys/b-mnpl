import { actionsStore, updateAction } from 'src/stores/actions.store';
import { OutcomeMessageType } from 'src/types/Board/board.types';
import { nanoid } from 'nanoid';
import {
  findFieldByPosition,
  buyCompany,
  mortgageNextRound,
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
import { setNewRoundEvent, setNewTurnEvent } from 'src/stores/board.store';

export const buyFieldModal = (): void => {
  const player = getActingPlayer('kkk');
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
  const user = getActingPlayer('kkk');
  const field = findFieldByPosition(user.meanPosition);
  let sum = field.price.startPrice;

  sum = buyCompany(field);

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
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payUnJailModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payTaxModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesAction = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const startAuctionModal = (): void => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
    userId: getActingPlayer('kkk').userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const switchPlayerTurn = (unJail: boolean = false): void => {
  const store = playersStore.getState();
  const index = getActingPlayerIndex('kkk');
  let player = getActingPlayer('kkk');
  let nextIndex = index;

  if (index === 0) {
    setNewRoundEvent();
  } else {
    setNewTurnEvent();
  }
  // Set Next round
  nextIndex === 0 && mortgageNextRound();

  // Doubled dices and jail
  if (player.movesLeft > 0) {
    nextIndex = index;
    updatePlayer('kkk', { ...player, movesLeft: --player.movesLeft });
  } else {
    nextIndex = getNextArrayIndex(index, store.players);
  }

  const res = store.players.map((v, k) => {
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

  updateAllPLayers('kkk', res);
  player = getActingPlayer('kkk');
  player.jailed ? unJailModal() : rollDicesModal();
};

const getNextArrayIndex = (index: number, array: any[]) =>
  index < array.length - 1 ? index + 1 : 0;
