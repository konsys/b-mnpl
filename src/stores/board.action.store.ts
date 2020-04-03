import { BoardActionType } from 'src/types/board.types';
import { createDomain } from 'effector';

interface ICurrentAction {
  action: BoardActionType | null;
  userId: number;
}

export const GameDomain = createDomain('GameDomain');
const BoardActionDomain = GameDomain.domain('boardActionDomain');
export const resetBoardActionEvent = BoardActionDomain.event();

export const setCurrentActionEvent = BoardActionDomain.event<ICurrentAction | null>();

export const boardActionsStore = BoardActionDomain.store<ICurrentAction | null>(
  null,
)
  .on(setCurrentActionEvent, (_, data) => data)
  .reset(resetBoardActionEvent);
