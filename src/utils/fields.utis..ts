import { fieldsStore } from 'src/stores/fields.store';
import { IField } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';

export const findFieldByPosition = (fieldPosition: number) => {
  const fields = fieldsStore.getState();
  return fields.find(v => v.fieldPosition === fieldPosition);
};

export const findBoughtFields = () => {
  const f = fieldsStore
    .getState()
    .filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);
  return f;
};

export const isFieldEmpty = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  // console.log(111111, user, field);
  return field && field.price && !field.owner;
};

export const canBuyField = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return field && field.price <= user.money;
};

export const getFieldIndex = (field: IField): number => {
  return fieldsStore.getState().findIndex(v => v.fieldId === field.fieldId);
};
