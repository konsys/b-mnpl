import { BoardActionType } from 'src/types/board.types';
import { createDomain } from 'effector';

export interface ICurrentAction {
  action: BoardActionType;
  isCompleted: boolean;
  userId: number;
  actionId: string;
  moveId: number;
  srcOfChange: string;
}

export const GameDomain = createDomain('GameDomain');
const ActionsDomain = GameDomain.domain('boardActionDomain');
export const resetActionsEvent = ActionsDomain.event();

export const setCurrentActionsEvent = ActionsDomain.event<ICurrentAction>();

export const actionsStore = ActionsDomain.store<ICurrentAction>(null)
  .on(setCurrentActionsEvent, (_, data) => data)
  .reset(resetActionsEvent);

// actionsStore.updates.watch(v => console.log('actionsStore', v));
