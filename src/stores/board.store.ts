import { GameDomain } from './actions.store';

const BoardDomain = GameDomain.domain('FieldsDomain');
export const resetBoardStoreEvent = BoardDomain.event();
export const setNewRoundEvent = BoardDomain.event();
export const setNextRound = BoardDomain.event();

export interface IBoardStore {
  isNewRound: boolean;
  gameRound: number;
  playersTurn: number;
}

export const boardStore = BoardDomain.store<IBoardStore>({
  gameRound: 0,
  isNewRound: false,
  playersTurn: 0,
})
  .on(setNewRoundEvent, (prev) => ({
    isNewRound: true,
    gameRound: ++prev.gameRound,
    playersTurn: ++prev.playersTurn,
  }))
  .on(setNextRound, (prev) => ({
    ...prev,
    isNewRound: false,
    playersTurn: ++prev.playersTurn,
  }))
  .reset(resetBoardStoreEvent);

boardStore.updates.watch((v) => console.log(12121212, v));
