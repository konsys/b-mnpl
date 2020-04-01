import { BoardActionTypes } from './types/board.types';
import { createDomain } from 'effector';

interface ICurrentAction {
  action: BoardActionTypes | null;
  userId: number;
}

const GameDomain = createDomain('GameDomain');
const boardActionDomain = GameDomain.domain('boardActionDomain');
export const resetBoardActionEvent = boardActionDomain.event();

export const setCurrentActionEvent = boardActionDomain.event<ICurrentAction | null>();

export const boardActionsStore = boardActionDomain
  .store<ICurrentAction | null>(null)
  .on(setCurrentActionEvent, (_, data) => {
    console.log('setBoardActionEvent', data);
  })
  .reset(resetBoardActionEvent);
