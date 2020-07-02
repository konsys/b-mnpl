import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { IField, IMoneyTransaction } from 'src/types/board.types';
import { getActingPlayer } from './users.utils';
import _ from 'lodash';
import { BANK_PLAYER_ID } from './board.params';
import { FieldType } from 'src/entities/board.fields.entity';
import { dicesStore } from 'src/stores/dices.store';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsState().fields.find((v) => v.fieldPosition === fieldPosition);

export const getActingField = (): IField => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  if (!field) throw Error(`Field not found: position: ${user.meanPosition}`);
  return field;
};

export const getBoughtFields = () =>
  fieldsStore
    .getState()
    .fields.filter((v) => v.owner && v.owner.userId > 0)
    .map((v) => v.owner);

export const isTax = (): boolean => getActingField().type === FieldType.TAX;

export const isStartPass = (): boolean => {
  const dices = dicesStore.getState();
  const player = getActingPlayer();

  return dices.sum > 0 && player.meanPosition - dices.sum < 0;
};
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

export const isFieldMortaged = () => {};

export const isMyField = (): boolean =>
  isCompany() &&
  getActingField().owner &&
  getActingField().owner.userId === getActingPlayer().userId;

export const canBuyField = (): boolean =>
  isCompany() && getActingField().price.startPrice <= getActingPlayer().money;

export const getFieldIndex = (field: IField): number =>
  fieldsState().fields.findIndex((v) => v.fieldId === field.fieldId);

export const updateField = (field: IField) => {
  const fields = fieldsState().fields;
  fields[getFieldIndex(field)] = field;
  updateAllFields(fields);
};

export const updateAllFields = (fields: IField[]) => {
  const version = fieldsState().version + 1;
  setFieldsEvent({
    version,
    fields,
  });
};

const getSameGroupFields = (field: IField) => {
  const fields = fieldsState().fields;
  const user = getActingPlayer();
  return _.concat(
    fields.filter(
      (v) =>
        v.fieldGroup === field.fieldGroup &&
        v.owner &&
        v.owner.userId === user.userId,
    ),
    field,
  );
};

export const buyCompany = (field: IField): number => {
  const user = getActingPlayer();
  const fields = fieldsState().fields;
  const fieldIndex = getFieldIndex(field);

  const sameGroupFieilds = getSameGroupFields(field);

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    sameGroup: sameGroupFieilds.length,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);
    v.owner.level = sameGroupFieilds.length || 0;

    fields[index] = { ...v, owner: { ...v.owner } };
  });

  fields[fieldIndex] = field;

  updateAllFields(fields);
  return field.price.startPrice;
};

export const buyITCompany = (field: IField): number => {
  const user = getActingPlayer();
  const fields = fieldsState().fields;
  const fieldIndex = getFieldIndex(field);

  const sameGroupFieilds = getSameGroupFields(field);

  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
    sameGroup: sameGroupFieilds.length,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);

    fields[index] = {
      ...v,
      owner: { ...v.owner },
    };
  });

  fields[fieldIndex] = field;

  updateAllFields(fields);
  return field.price.startPrice;
};

export const fieldsState = () => fieldsStore.getState();
