import { fieldsStore } from 'src/stores/fields.store';
import { IField } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';
import { FieldType } from 'src/entities/board.fields.entity';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsStore.getState().find(v => v.fieldPosition === fieldPosition);

export const findBoughtFields = () =>
  fieldsStore
    .getState()
    .filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);

export const isFieldEmpty = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return field && !field.owner;
};

export const canBuyField = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return field && field.type === FieldType.COMPANY && field.price <= user.money;
};

export const getFieldIndex = (field: IField): number =>
  fieldsStore.getState().findIndex(v => v.fieldId === field.fieldId);
