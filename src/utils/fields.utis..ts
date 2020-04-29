import { fieldsStore } from 'src/stores/fields.store';
import { IField, IPaymentTransaction } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';
import { FieldType } from 'src/entities/board.fields.entity';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsStore.getState().find(v => v.fieldPosition === fieldPosition);

export const getActingField = (): IField => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  if (!field) throw Error('Field not found');
  return field;
};

export const findBoughtFields = () =>
  fieldsStore
    .getState()
    .filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);

export const isTax = (): boolean => {
  const field = getActingField();
  return field.type === FieldType.TAX || field.type === FieldType.CHANCE;
};

export const isChance = (): boolean =>
  getActingField().type === FieldType.CHANCE;

export const payTaxData = (): IPaymentTransaction => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return {
    sum: -field.price,
    userId: user.userId,
    toUserId: (field.owner && field.owner.userId) || 0,
  };
};

export const isFieldEmpty = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return field.type === FieldType.COMPANY && !field.owner;
};

export const isMyField = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return (
    field.type === FieldType.COMPANY &&
    field.owner &&
    field.owner.userId === user.userId
  );
};

export const canBuyField = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return field.type === FieldType.COMPANY && field.price <= user.money;
};

export const getFieldIndex = (field: IField): number =>
  fieldsStore.getState().findIndex(v => v.fieldId === field.fieldId);
