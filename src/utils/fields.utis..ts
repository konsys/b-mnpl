import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { IField, IPaymentTransaction, FieldType } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsStore.getState().fields.find(v => v.fieldPosition === fieldPosition);

export const getActingField = (): IField => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  if (!field) throw Error('Field not found');
  return field;
};

export const findBoughtFields = () =>
  fieldsStore
    .getState()
    .fields.filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);

export const isTax = (): boolean => getActingField().type === FieldType.TAX;

export const isCompany = (field): boolean =>
  field.type === FieldType.COMPANY ||
  field.type === FieldType.AUTO ||
  field.type === FieldType.IT;

export const isChance = (): boolean =>
  getActingField().type === FieldType.CHANCE;

export const payTaxData = (): IPaymentTransaction => {
  const user = getActingPlayer();
  const field = getActingField();
  return {
    sum: -field.price,
    userId: user.userId,
    toUserId: (field.owner && field.owner.userId) || 0,
  };
};

export const noActionField = (): boolean => {
  const field = getActingField();
  return (
    field.type === FieldType.TAKE_REST ||
    field.type === FieldType.CASION ||
    field.type === FieldType.START
  );
};

export const isFieldEmpty = (): boolean => {
  const field = getActingField();
  return isCompany(field) && !field.owner;
};

export const isMyField = (): boolean => {
  const user = getActingPlayer();
  const field = getActingField();
  return isCompany(field) && field.owner && field.owner.userId === user.userId;
};

export const canBuyField = (): boolean => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  return isCompany(field) && field.price <= user.money;
};

export const getFieldIndex = (field: IField): number =>
  fieldsStore.getState().fields.findIndex(v => v.fieldId === field.fieldId);

export const updateField = (field: IField) => {
  const fields = fieldsStore.getState().fields;
  fields[getFieldIndex(field)] = field;
  updateAllFields(fields);
};

export const updateAllFields = (fields: IField[]) => {
  const version = fieldsStore.getState().version + 1;
  console.log(111111, version);
  setFieldsEvent({
    version,
    fields,
  });
};
