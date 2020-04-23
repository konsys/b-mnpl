import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { BoardActionType, IPlayer, IField } from 'src/types/board.types';
import nanoid from 'nanoid';
import { findFieldByPosition } from './fields.utis.';
import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';

export const buyFieldModalAction = (user: IPlayer): void => {
  const action = actionsStore.getState();
  const currentField = findFieldByPosition(user.meanPosition);
  setCurrentActionsEvent({
    action: BoardActionType.CAN_BUY,
    userId: user.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesMessage dices buy',
  });
};
export const buyFieldAction = (user: IPlayer, field: IField): void => {
  const fields = fieldsStore.getState();
  const index = fields.findIndex(v => v.fieldPosition === field.fieldPosition);
  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
  };
  fields[index] = field;
  setFieldsEvent(fields);
};

export const rollDicesAction = (user: IPlayer): void => {
  const action = actionsStore.getState();
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES_MODAL,
    userId: user.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesMessage dices roll',
  });
};
