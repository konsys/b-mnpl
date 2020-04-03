import { BoardActionType } from '../types/board.types';
import { createDomain } from 'effector';

interface ICurrentAction {
  action: BoardActionType | null;
  userId: number;
}

const GameDomain = createDomain('GameDomain');
const BoardActionDomain = GameDomain.domain('boardActionDomain');
export const resetBoardActionEvent = BoardActionDomain.event();

export const setCurrentActionEvent = BoardActionDomain.event<ICurrentAction | null>();
export const getCurrentActionEvent = BoardActionDomain.event<ICurrentAction | null>();

export const boardActionsStore = BoardActionDomain.store<ICurrentAction | null>(
  null,
)
  .on(setCurrentActionEvent, (_, data) => {
    console.log('setBoardActionEvent', data);
    return data;
  })
  .reset(resetBoardActionEvent);
