import {
  OutcomeMessageType,
  IDicesModal,
  IUnJailModal,
  IShowCanBuyModal,
  IPayRentStart,
  IDoNothing,
  IRollDicesMessage,
} from 'src/types/board.types';
import { getActingPlayer } from 'src/utils/users.utils';
import { actionsStore } from 'src/stores/actions.store';
import { findFieldByPosition } from 'src/utils/fields.utils';
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
  // userId: getActingPlayer().userId,
  // action: OutcomeMessageType.DO_NOTHING,
  // userId: getActingPlayer().userId,
  // actionId: nanoid(4),
  // moveId: actionsStore.getState().moveId + 1,
});

export const buyModalHandler = (): IShowCanBuyModal => {
  const user = getActingPlayer();

  return {
    type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
    userId: user.userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    field: findFieldByPosition(user.meanPosition),
    money: user.money,
    _id: actionsStore.getState().actionId,
  };
};

export const payModalHandler = (): IPayRentStart => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);

  const action = actionsStore.getState();
  return {
    type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
    userId: user.userId,
    title: 'Заплатить',
    text: `Вы должны заплатить ${field.price}k`,
    field: field,
    money: user.money,

    // TODO доделать платеж игроку
    toUserId: 0,
    _id: action.actionId,
  };
};

export const rollDicesMessage = (): IRollDicesMessage => {
  let dicesState: IDicesStore = null;
  dicesStore.watch(v => {
    dicesState = v;
  });

  // Send message to roll dices and waits for css transition is complete
  const action = actionsStore.getState();
  if (!dicesState || dicesState._id !== action.actionId) {
    setRandomDicesEvent(action.actionId);
  }
  return {
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
    userId: getActingPlayer().userId,
    dices: dicesState.dices,
    meanPosition: dicesState.meanPosition,
    isDouble: dicesState.isDouble,
    isTriple: dicesState.isTriple,
    _id: action.actionId,
  };
};
