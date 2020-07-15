// import { updateFieldActionsEvent } from './fields.store';
// import {
//   IPlayerAction,
//   IBoardStore,
// } from 'src/api.gateway/action/store.service';
// import { createDomain } from 'effector';

// const BoardDomain = createDomain('FieldsDomain');
// export const resetBoardStoreEvent = BoardDomain.event();
// export const setNewRoundEvent = BoardDomain.event();
// export const setNewTurnEvent = BoardDomain.event();
// export const setPlayerActionEvent = BoardDomain.event<IPlayerAction>();
// export const setNextRound = BoardDomain.event();

// // Update field actions on new round
// setNewRoundEvent.watch((v) => updateFieldActionsEvent());

// export const boardStore = BoardDomain.store<IBoardStore>({
//   gameRound: 0,
//   isNewRound: false,
//   playersTurn: 0,
//   playerActions: [],
// })
//   .on(setNewRoundEvent, (prev) => {
//     return {
//       isNewRound: true,
//       gameRound: ++prev.gameRound,
//       playersTurn: ++prev.playersTurn,
//       playerActions: [],
//     };
//   })
//   .on(setNewTurnEvent, (prev) => ({
//     isNewRound: false,
//     gameRound: prev.gameRound,
//     playersTurn: ++prev.playersTurn,
//     playerActions: [],
//   }))
//   .on(setPlayerActionEvent, (prev, playerActions) => ({
//     ...prev,
//     playerActions: [...prev.playerActions, playerActions],
//   }))
//   .on(setNextRound, (prev) => ({
//     ...prev,
//     isNewRound: false,
//     playersTurn: ++prev.playersTurn,
//   }))
//   .reset(resetBoardStoreEvent);

export const rsdfg = 'sdfsd';
