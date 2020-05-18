import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { IField, IPaymentTransaction, FieldType } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';
import { getPercentPart } from './actions.utils';
import {
  ONE_AUTO_PERCENT,
  TWO_AUTO_PERCENT,
  FREE_AUTO_PERCENT,
  FOUR_AUTO_PERCENT,
  ONE_FIELD_PERCENT,
  TWO_FIELD_PERCENT,
  FREE_FIELD_PERCENT,
} from './board.params.utils';

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
export const isStart = (): boolean => getActingField().type === FieldType.START;
export const isJail = (): boolean => getActingField().type === FieldType.JAIL;

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
  return field.type === FieldType.TAKE_REST || field.type === FieldType.CASION;
};

export const isCompanyForSale = (): boolean => {
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
  setFieldsEvent({
    version,
    fields,
  });
};

const getSameGroupFields = (field: IField) => {
  const fieldsState = fieldsStore.getState().fields;
  const user = getActingPlayer();
  return fieldsState.filter(
    v =>
      v.fieldGroup === field.fieldGroup &&
      v.owner &&
      v.owner.userId === user.userId,
  );
};

export const buyAuto = (field: IField): number => {
  const user = getActingPlayer();
  const fieldsState = fieldsStore.getState().fields;
  const fieldIndex = getFieldIndex(field);

  let price = field.price;
  const fieldPrice = price;
  const sameGroupFieilds = getSameGroupFields(field);

  if (!sameGroupFieilds.length) {
    price = getPercentPart(price, ONE_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 1) {
    price = getPercentPart(price, TWO_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 2) {
    price = getPercentPart(price, FREE_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 3) {
    price = getPercentPart(price, FOUR_AUTO_PERCENT);
  } else {
    price = getPercentPart(price, ONE_FIELD_PERCENT);
  }

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: price,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);

    fieldsState[index] = { ...v, owner: { ...v.owner, updatedPrice: price } };
  });

  fieldsState[fieldIndex] = field;

  updateAllFields(fieldsState);
  return fieldPrice;
};

export const buyCompany = (field: IField): number => {
  const user = getActingPlayer();
  const fieldsState = fieldsStore.getState().fields;
  const fieldIndex = getFieldIndex(field);

  let price = field.price;
  const fieldPrice = price;

  const sameGroupFieilds = getSameGroupFields(field);

  if (!sameGroupFieilds.length) {
    price = getPercentPart(price, ONE_FIELD_PERCENT);
  } else if (sameGroupFieilds.length === 1) {
    price = getPercentPart(price, TWO_FIELD_PERCENT);
  } else if (sameGroupFieilds.length === 1) {
    price = getPercentPart(price, FREE_FIELD_PERCENT);
  }

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: price,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);

    fieldsState[index] = { ...v, owner: { ...v.owner, updatedPrice: price } };
  });

  fieldsState[fieldIndex] = field;

  updateAllFields(fieldsState);
  return fieldPrice;
};
