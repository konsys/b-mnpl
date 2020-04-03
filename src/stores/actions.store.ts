import { BoardActionType } from 'src/types/board.types';
import { createDomain } from 'effector';

interface ICurrentAction {
  action: BoardActionType | null;
  userId: number;
  srcOfChange: string;
}

export const GameDomain = createDomain('GameDomain');
const ActionsDomain = GameDomain.domain('boardActionDomain');
export const resetActionsEvent = ActionsDomain.event();

export const setCurrentActionsEvent = ActionsDomain.event<ICurrentAction | null>();

export const actionsStore = ActionsDomain.store<ICurrentAction | null>(null)
  .on(setCurrentActionsEvent, (_, data) => data)
  .reset(resetActionsEvent);
