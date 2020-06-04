import {
  OutcomeMessageType,
  IDicesModal,
  IUnJailModal,
  IShowCanBuyModal,
  IPayRentStart,
  IDoNothing,
  IRollDicesMessage,
  IncomeMessageType,
} from 'src/types/board.types';
import { getActingPlayer, unjailPlayer } from 'src/utils/users.utils';
import { actionsStore } from 'src/stores/actions.store';
import { findFieldByPosition, getActingField } from 'src/utils/fields.utils';
import nanoid from 'nanoid';
import {
  IDicesStore,
  dicesStore,
  setRandomDicesEvent,
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
});

export const unJailModalMesage = (): IUnJailModal => ({
  type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
  userId: getActingPlayer().userId,
  title: 'Выйти из тюрьмы',
  text: 'Можете выйти, заплатив залог или кинуть кубики на удачу',
  _id: actionsStore.getState().actionId,
});

export const doNothingMessage = (): IDoNothing => ({
  type: OutcomeMessageType.DO_NOTHING,
  _id: nanoid(),
  userId: getActingPlayer().userId,
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
  };
};

export const payModalHandler = (): IPayRentStart => {
  const player = getActingPlayer();
  const field = getActingField();
  const action = actionsStore.getState();
  return {
    type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: player.userId,
    title: 'Заплатить',
    text: `Вы должны заплатить ${field.price}k`,
    field: field,
    money: player.money,
    toUserId: field.owner && field.owner.userId,
    _id: action.actionId,
  };
};

export const rollDicesMessage = (): IRollDicesMessage => {
  let dicesState: IDicesStore = dicesStore.getState();
  const player = getActingPlayer();

  // Send message to roll dices and waits for css transition is complete
  const action = actionsStore.getState();
  if (!dicesState || dicesState._id !== action.actionId) {
    setRandomDicesEvent(action.actionId);
  }
  console.log(11111, player.meanPosition);
  // if (dicesState.isDouble) {
  //   unjailPlayer();
  // } else {
  //   return;
  // }
  return {
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
    toMoveToken: true,
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

    case OutcomeMessageType.DO_NOTHING:
      return doNothingMessage();
  }
};
