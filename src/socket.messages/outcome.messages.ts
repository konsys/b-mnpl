import {
  OutcomeMessageType,
  IDicesModal,
  IUnJailModal,
  IShowCanBuyModal,
  IPayRentStart,
  IDoNothing,
  IRollDicesMessage,
  IncomeMessageType,
  IUnJailPayingModal,
} from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users.utils';
import { actionsStore } from 'src/stores/actions.store';
import { transactionStore } from 'src/stores/transactions.store';
import { findFieldByPosition, getActingField } from 'src/utils/fields.utils';
import nanoid from 'nanoid';
import {
  dicesStore,
  setRandomDicesEvent,
  dicesUpdatePlayerToken,
} from 'src/stores/dices.store';

/**
 * Shows modals
 */
export const rollDicesModalMessage = (): IDicesModal => ({
  type: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
  userId: getActingPlayer().userId,
  title: 'Кидайте кубики',
  text: 'Мы болеем за вас',
  _id: actionsStore.getState().actionId,
  isModal: true,
});

export const unJailModalMesage = (): IUnJailModal => ({
  type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
  userId: getActingPlayer().userId,
  title: 'Заплатить залог',
  text: 'Заплатить за выход из тюрьмы',
  _id: actionsStore.getState().actionId,
  isModal: true,
});

export const unJailPayModalMesage = (): IUnJailPayingModal => ({
  type: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
  userId: getActingPlayer().userId,
  title: 'Заплатить залог',
  text: 'Заплатить за выход из тюрьмы',
  _id: actionsStore.getState().actionId,
  isModal: true,
});

export const doNothingMessage = (): IDoNothing => ({
  type: OutcomeMessageType.DO_NOTHING,
  _id: nanoid(),
  userId: getActingPlayer().userId,
  isModal: false,
});

export const buyModalHandler = (): IShowCanBuyModal => {
  const player = getActingPlayer();

  return {
    type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
    userId: player.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    field: findFieldByPosition(player.meanPosition),
    money: player.money,
    _id: actionsStore.getState().actionId,
    isModal: true,
  };
};

export const payModalHandler = (): IPayRentStart => {
  const player = getActingPlayer();
  const field = getActingField();
  const action = actionsStore.getState();
  const transaction = transactionStore.getState();
  const sum = (transaction && transaction.money) || field.price;
  return {
    type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: player.userId,
    title: 'Заплатить',
    text: `${transaction && transaction.reason + '. '}`,
    field: field,
    money: sum,
    toUserId: field.owner && field.owner.userId,
    _id: action.actionId,
    isModal: true,
  };
};

export const rollDicesMessage = (): IRollDicesMessage | IDoNothing => {
  const action = actionsStore.getState();
  setRandomDicesEvent(action.actionId);
  let dicesState = dicesStore.getState();
  dicesUpdatePlayerToken(dicesState);

  return {
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
    isModal: false,
  };
};

// When emit message action store to action message adapter
export const actionTypeToEventAdapter = (
  type: OutcomeMessageType | IncomeMessageType,
) => {
  switch (type) {
    case OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL:
      return rollDicesModalMessage();

    case OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION:
      return rollDicesMessage();

    case OutcomeMessageType.OUTCOME_CAN_BUY_MODAL:
      return buyModalHandler();

    case OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL:
      return payModalHandler();

    case OutcomeMessageType.OUTCOME_UN_JAIL_MODAL:
      return unJailModalMesage();

    case OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL:
      return unJailPayModalMesage();

    case OutcomeMessageType.DO_NOTHING:
      return doNothingMessage();
  }
};
