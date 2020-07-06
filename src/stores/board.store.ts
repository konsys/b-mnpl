import { GameDomain } from './actions.store';
import { IFieldAction } from 'src/types/Board/board.types';

const BoardDomain = GameDomain.domain('FieldsDomain');
export const resetBoardStoreEvent = BoardDomain.event();
export const setNewRoundEvent = BoardDomain.event();
export const setNewTurnEvent = BoardDomain.event();
export const setPlayerActionEvent = BoardDomain.event<IPlayerAction>();
export const setNextRound = BoardDomain.event();

export interface IPlayerAction {
  userId: number;
  fieldId: number;
  fieldGroup: number;
  fieldAction: IFieldAction;
}

export interface IBoardStore {
  isNewRound: boolean;
  gameRound: number;
  playersTurn: number;
  playerActions: IPlayerAction[];
}

export const boardStore = BoardDomain.store<IBoardStore>({
  gameRound: 0,
  isNewRound: false,
  playersTurn: 0,
  playerActions: [],
})
  .on(setNewRoundEvent, (prev) => ({
    isNewRound: true,
    gameRound: ++prev.gameRound,
    playersTurn: ++prev.playersTurn,
    playerActions: [],
  }))
  .on(setNewTurnEvent, (prev) => ({
    isNewRound: false,
    gameRound: prev.gameRound,
    playersTurn: ++prev.playersTurn,
    playerActions: [],
  }))
  .on(setPlayerActionEvent, (prev, playerActions) => ({
    ...prev,
    playerActions: [...prev.playerActions, playerActions],
  }))
  .on(setNextRound, (prev) => ({
    ...prev,
    isNewRound: false,
    playersTurn: ++prev.playersTurn,
  }))
  .reset(resetBoardStoreEvent);

boardStore.updates.watch((v) =>
  console.log('boardStoreWatch', v.playerActions),
);
