// import {
//   OutcomeMessageType,
//   IDicesModal,
//   IUnJailModal,
//   IShowCanBuyModal,
//   IPayRentModal,
//   IDoNothing,
//   IRollDicesMessage,
//   IncomeMessageType,
//   IUnJailPayingModal,
// } from 'src/types/Board/board.types';
// import { actionsStore } from 'src/stores/actions.store';
// import { nanoid } from 'nanoid';
// import {
//   dicesStore,
//   setRandomDicesEvent,
//   dicesUpdatePlayerToken,
// } from 'src/stores/dices.store';
// import { getTransaction } from 'src/stores/transactions.store';

// /**
//  * Shows modals
//  */
// export const rollDicesModalMessage = async (): Promise<IDicesModal> => ({
//   type: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
//   userId: (await getActingPlayer('kkk')).userId,
//   title: 'Кидайте кубики',
//   text: 'Мы болеем за вас',
//   _id: actionsStore.getState().actionId,
//   isModal: true,
// });

// export const unJailModalMesage = async (): Promise<IUnJailModal> => ({
//   type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
//   userId: (await getActingPlayer('kkk')).userId,
//   title: 'Заплатить залог',
//   text: 'Заплатить за выход из тюрьмы',
//   _id: actionsStore.getState().actionId,
//   isModal: true,
// });

// export const unJailPayModalMesage = async (): Promise<IUnJailPayingModal> => {
//   const transaction = await getTransaction('kkk');
//   return {
//     type: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
//     userId: (await getActingPlayer('kkk')).userId,
//     title: 'Заплатить залог',
//     text: 'Заплатить за выход из тюрьмы',
//     _id: actionsStore.getState().actionId,
//     isModal: true,
//     money: (transaction && transaction.sum) || 0,
//   };
// };

// export const doNothingMessage = async (): Promise<IDoNothing> => ({
//   type: OutcomeMessageType.DO_NOTHING,
//   _id: nanoid(),
//   userId: (await getActingPlayer('kkk')).userId,
//   isModal: false,
// });

// export const buyModalHandler = async (): Promise<IShowCanBuyModal> => {
//   const player = await getActingPlayer('kkk');

//   return {
//     type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
//     userId: player.userId,
//     title: 'Купить поле',
//     text: 'Вы можете купить поле или поставить его на аукцион',
//     field: findFieldByPosition(player.meanPosition),
//     money: player.money,
//     _id: actionsStore.getState().actionId,
//     isModal: true,
//   };
// };

// export const payModalHandler = async (): Promise<IPayRentModal> => {
//   const player = await getActingPlayer('kkk');
//   const field = await getActingField('kkk');
//   const action = actionsStore.getState();
//   const transaction = await getTransaction('kkk');
//   const sum = (transaction && transaction.sum) || 0;
//   return {
//     type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
//     userId: player.userId,
//     title: 'Заплатить',
//     text: `${transaction && transaction.reason + '. '}`,
//     field: field,
//     money: sum,
//     toUserId: field.status && field.status.userId,
//     _id: action.actionId,
//     isModal: true,
//   };
// };

// export const rollDicesMessage = async (): Promise<
//   IRollDicesMessage | IDoNothing
// > => {
//   const action = actionsStore.getState();
//   setRandomDicesEvent(action.actionId);
//   let dicesState = dicesStore.getState();
//   dicesUpdatePlayerToken(dicesState);

//   return {
//     type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
//     userId: (await getActingPlayer('kkk')).userId,
//     dices: dicesState.dices,
//     meanPosition: dicesState.meanPosition,
//     isDouble: dicesState.isDouble,
//     isTriple: dicesState.isTriple,
//     _id: action.actionId,
//     isModal: false,
//   };
// };

// // When emit message action store to action message adapter
// export const actionTypeToEventAdapter = async (
//   type: OutcomeMessageType | IncomeMessageType,
// ) => {
//   switch (type) {
//     case OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL:
//       return rollDicesModalMessage();

//     case OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION:
//       return rollDicesMessage();

//     case OutcomeMessageType.OUTCOME_CAN_BUY_MODAL:
//       return buyModalHandler();

//     case OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL:
//       return payModalHandler();

//     case OutcomeMessageType.OUTCOME_UN_JAIL_MODAL:
//       return unJailModalMesage();

//     case OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL:
//       return unJailPayModalMesage();

//     case OutcomeMessageType.DO_NOTHING:
//       return doNothingMessage();
//   }
// };
export const sdf = 'asd';
