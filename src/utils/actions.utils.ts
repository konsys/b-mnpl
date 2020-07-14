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
import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
import { BOARD_PARAMS } from '../params/board.params';
import { setNewRoundEvent, setNewTurnEvent } from 'src/stores/board.store';
import { getPlayersStore } from 'src/stores/players.store';

export const buyFieldModal = async (): Promise<void> => {
  const player = await getActingPlayer('kkk');
  const action = actionsStore.getState();
  updateAction({
    action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
  });
};

export const buyField = async (): Promise<void> => {
  // Field set to player
  const user = await getActingPlayer('kkk');
  const field = findFieldByPosition(user.meanPosition);
  let sum = field.price.startPrice;

  sum = await buyCompany(field);

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

export const unJailModal = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payUnJailModal = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const payTaxModal = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesAction = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const rollDicesModal = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const startAuctionModal = async (): Promise<void> => {
  updateAction({
    action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
    userId: (await getActingPlayer('kkk')).userId,
    actionId: nanoid(4),
    moveId: actionsStore.getState().moveId + 1,
  });
};

export const switchPlayerTurn = async (
  unJail: boolean = false,
): Promise<Promise<void>> => {
  const store = await getPlayersStore('kkk');
  const index = await getActingPlayerIndex('kkk');
  let player = await getActingPlayer('kkk');
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
    nextIndex = await getNextArrayIndex(index, store.players);
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
  player = await getActingPlayer('kkk');
  player.jailed ? unJailModal() : rollDicesModal();
};

const getNextArrayIndex = async (index: number, array: any[]) =>
  index < array.length - 1 ? index + 1 : 0;
