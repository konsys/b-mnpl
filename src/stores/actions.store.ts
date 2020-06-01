import { createDomain } from 'effector';
import { OutcomeMessageType, IncomeMessageType } from 'src/types/board.types';

export interface ICurrentAction {
  action: OutcomeMessageType | IncomeMessageType;
  userId: number;
  actionId: string;
  moveId: number;
  srcOfChange: string;
  isCompleted: boolean;
}

export const GameDomain = createDomain('GameDomain');
const ActionsDomain = GameDomain.domain('boardActionDomain');
export const resetActionsEvent = ActionsDomain.event();

export const setCurrentActionsEvent = ActionsDomain.event<ICurrentAction>();

export const actionsStore = ActionsDomain.store<ICurrentAction>(null)
  .on(setCurrentActionsEvent, (_, data) => data)
  .reset(resetActionsEvent);

export const updateAction = (action: any) => {
  setCurrentActionsEvent(action);
};
// actionsStore.updates.watch(v => console.log('actionsStore', v));
