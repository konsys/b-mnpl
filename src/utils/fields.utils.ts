import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { IField, IMoneyTransaction } from 'src/types/Board/board.types';
import { getActingPlayer } from './users.utils';
import _ from 'lodash';
import { BOARD_PARAMS } from '../params/board.params';
import { FieldType } from 'src/entities/board.fields.entity';
import { dicesStore } from 'src/stores/dices.store';
import { nanoid } from 'nanoid';
import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
import { mortgageFieldEvent } from 'src/stores/mortgage.store';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsState().fields.find((v) => v.fieldPosition === fieldPosition);

export const getActingField = (): IField => {
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  if (!field) throw Error(`Field not found: position: ${user.meanPosition}`);
  return field;
};

export const getFieldById = (fieldId: number) =>
  fieldsState().fields.find((v) => v.fieldId === fieldId);

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

export const isMortgaged = (fieldId: number): boolean => {
  const field = getFieldById(fieldId);
  return field && field.owner && field.owner.mortgaged > 0;
};

export const isCompany = (fieldId: number): boolean => {
  const type = getFieldById(fieldId).type;
  return (
    type &&
    (type === FieldType.COMPANY ||
      type === FieldType.AUTO ||
      type === FieldType.IT)
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
  (getActingField().owner && getActingField().owner.userId) ||
  BOARD_PARAMS.BANK_PLAYER_ID;

export const noActionField = (): boolean => {
  const field = getActingField();
  return field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO;
};

export const isCompanyForSale = (fieldId: number): boolean =>
  isCompany(getActingField().fieldId) &&
  getFieldById(fieldId) &&
  !getFieldById(fieldId).owner;

export const isFieldMortaged = () => {};

export const isMyField = (fieldId: number): boolean => {
  const field = getFieldById(fieldId);
  return (
    isCompany(fieldId) &&
    field.owner &&
    field.owner.userId === getActingPlayer().userId
  );
};

export const canBuyField = (): boolean =>
  isCompany(getActingField().fieldId) &&
  getActingField().price.startPrice <= getActingPlayer().money;

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
    mortgaged: 0,
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
    mortgaged: 0,
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

export const mortgage = (fieldId: number): void => {
  const field = getFieldById(fieldId);
  const player = getActingPlayer();
  const fields = fieldsState().fields;
  const fieldIndex = getFieldIndex(field);

  mortgageFieldEvent({
    fieldId: field.fieldId,
    mortgaged: BOARD_PARAMS.MORTGAGE_TURNS,
  });

  fields[fieldIndex] = {
    ...field,
    owner: { ...field.owner, mortgaged: BOARD_PARAMS.MORTGAGE_TURNS },
  };
  updateAllFields(fields);

  const transactionId = nanoid(4);
  setTransactionEvent({
    sum: field.price.pledgePrice,
    reason: `Money for pledge ${field.name}`,
    toUserId: player.userId,
    transactionId,
    userId: BOARD_PARAMS.BANK_PLAYER_ID,
  });
  transactMoneyEvent(transactionId);
};

export const fieldsState = () => fieldsStore.getState();
