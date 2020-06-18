import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { IField, IMoneyTransaction } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';
import { calcPercentPart } from './actions.utils';
import _ from 'lodash';
import {
  ONE_AUTO_PERCENT,
  TWO_AUTO_PERCENT,
  FREE_AUTO_PERCENT,
  FOUR_AUTO_PERCENT,
  ONE_FIELD_PERCENT,
  TWO_FIELD_PERCENT,
  FREE_FIELD_PERCENT,
  ONE_IT_FIELD_MULT,
  TWO_IT_FIELD_MULT,
  BANK_PLAYER_ID,
} from './board.params';
import { FieldType } from 'src/entities/board.fields.entity';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsStore.getState().fields.find((v) => v.fieldPosition === fieldPosition);

export const getActingField = (): IField => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  if (!field) throw Error('Field not found');
  return field;
};

export const getBoughtFields = () =>
  fieldsStore
    .getState()
    .fields.filter((v) => v.owner && v.owner.userId > 0)
    .map((v) => v.owner);

export const isTax = (): boolean => getActingField().type === FieldType.TAX;
export const isStart = (): boolean => getActingField().type === FieldType.START;
export const isJail = (): boolean => getActingField().type === FieldType.JAIL;

export const isCompany = (): boolean => {
  const type = getActingField().type;
  return (
    type === FieldType.COMPANY ||
    type === FieldType.AUTO ||
    type === FieldType.IT
  );
};

export const isChance = (): boolean =>
  getActingField().type === FieldType.CHANCE;

export const moneyTransactionParams = (): IMoneyTransaction => {
  const field = getActingField();
  return {
    sum: -field.price,
    userId: getActingPlayer().userId,
    toUserId: (field.owner && field.owner.userId) || 0,
  };
};

export const whosField = (): number =>
  (getActingField().owner && getActingField().owner.userId) || BANK_PLAYER_ID;

export const noActionField = (): boolean => {
  const field = getActingField();
  return field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO;
};

export const isCompanyForSale = (): boolean =>
  isCompany() && !getActingField().owner;

export const isMyField = (): boolean =>
  isCompany() &&
  getActingField().owner &&
  getActingField().owner.userId === getActingPlayer().userId;

export const canBuyField = (): boolean =>
  isCompany() && getActingField().price <= getActingPlayer().money;

export const getFieldIndex = (field: IField): number =>
  fieldsStore.getState().fields.findIndex((v) => v.fieldId === field.fieldId);

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
  return _.concat(
    fieldsState.filter(
      (v) =>
        v.fieldGroup === field.fieldGroup &&
        v.owner &&
        v.owner.userId === user.userId,
    ),
    field,
  );
};

export const buyAuto = (field: IField): number => {
  const user = getActingPlayer();
  const fieldsState = fieldsStore.getState().fields;
  const fieldIndex = getFieldIndex(field);

  let price = field.price;
  const fieldPrice = price;
  const sameGroupFieilds = getSameGroupFields(field);

  if (sameGroupFieilds.length === 1) {
    price = calcPercentPart(price, ONE_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 2) {
    price = calcPercentPart(price, TWO_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 3) {
    price = calcPercentPart(price, FREE_AUTO_PERCENT);
  } else if (sameGroupFieilds.length === 4) {
    price = calcPercentPart(price, FOUR_AUTO_PERCENT);
  }

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: price,
    paymentMultiplier: 0,
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

  let percent = ONE_FIELD_PERCENT;

  if (sameGroupFieilds.length === 2) {
    percent = TWO_FIELD_PERCENT;
  } else if (sameGroupFieilds.length === 3) {
    percent = FREE_FIELD_PERCENT;
  }

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: calcPercentPart(price, percent),
    paymentMultiplier: 0,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);

    fieldsState[index] = {
      ...v,
      owner: { ...v.owner, updatedPrice: calcPercentPart(v.price, percent) },
    };
  });

  fieldsState[fieldIndex] = field;

  updateAllFields(fieldsState);
  return fieldPrice;
};

export const buyITCompany = (field: IField): number => {
  const user = getActingPlayer();
  const fieldsState = fieldsStore.getState().fields;
  const fieldIndex = getFieldIndex(field);

  let paymentMultiplier = 0;

  const sameGroupFieilds = getSameGroupFields(field);

  if (sameGroupFieilds.length === 1) {
    paymentMultiplier = calcPercentPart(field.price, ONE_IT_FIELD_MULT);
  } else if (sameGroupFieilds.length === 2) {
    paymentMultiplier = calcPercentPart(field.price, TWO_IT_FIELD_MULT);
  }

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    updatedPrice: 0,
    paymentMultiplier,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);

    fieldsState[index] = {
      ...v,
      owner: { ...v.owner, updatedPrice: 0, paymentMultiplier },
    };
  });

  fieldsState[fieldIndex] = field;

  updateAllFields(fieldsState);
  return paymentMultiplier;
};
