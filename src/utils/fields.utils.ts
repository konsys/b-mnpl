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
import { version } from 'os';

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

export const getFieldIndexById = (fieldId: number) =>
  fieldsState().fields.findIndex((v) => v.fieldId === fieldId);

export const getBoughtFields = () =>
  fieldsStore
    .getState()
    .fields.filter((v) => v.status && v.status.userId > 0)
    .map((v) => v.status);

export const isTax = (): boolean => getActingField().type === FieldType.TAX;

export const isStartPass = (): boolean => {
  const dices = dicesStore.getState();
  const player = getActingPlayer();

  return dices.sum > 0 && player.meanPosition - dices.sum < 0;
};
export const isJail = (): boolean => getActingField().type === FieldType.JAIL;

export const isMortgaged = (fieldId: number): boolean => {
  const field = getFieldById(fieldId);
  return field && field.status && field.status.mortgaged > 0;
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
    toUserId: (field.status && field.status.userId) || 0,
  };
};

export const whosField = (): number =>
  (getActingField().status && getActingField().status.userId) ||
  BOARD_PARAMS.BANK_PLAYER_ID;

export const noActionField = (): boolean => {
  const field = getActingField();
  return field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO;
};

export const isCompanyForSale = (fieldId: number): boolean =>
  isCompany(getActingField().fieldId) &&
  getFieldById(fieldId) &&
  !getFieldById(fieldId).status;

export const isFieldMortaged = () => {};

export const isMyField = (fieldId: number): boolean => {
  const field = getFieldById(fieldId);
  return (
    isCompany(fieldId) &&
    field.status &&
    field.status.userId === getActingPlayer().userId
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
        v.status &&
        v.status.userId === user.userId,
    ),
    field,
  );
};

export const buyCompany = (field: IField): number => {
  const user = getActingPlayer();
  const fields = fieldsState().fields;
  const fieldIndex = getFieldIndex(field);

  const sameGroupFieilds = getSameGroupFields(field);

  field.status = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: 0,
    sameGroup: sameGroupFieilds.length,
  };

  sameGroupFieilds.map((v: IField) => {
    const index = getFieldIndex(v);
    v.status.level = sameGroupFieilds.length || 0;

    fields[index] = { ...v, status: { ...v.status } };
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

  field.status = {
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
      status: { ...v.status },
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

  fields[fieldIndex] = {
    ...field,
    status: { ...field.status, mortgaged: BOARD_PARAMS.MORTGAGE_TURNS },
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

export const mortgageNextRound = () => {
  const fields = fieldsState().fields;
  const r = fields.map((v: IField) => {
    return v.status && v.status.mortgaged > 1
      ? { ...v, status: { ...v.status, mortgaged: --v.status.mortgaged } }
      : v.status && v.status.mortgaged
      ? { ...v, status: undefined }
      : { ...v };
  });
  return r;
};

export const unMortgage = (fieldId: number): void => {
  const field = getFieldById(fieldId);
  const player = getActingPlayer();
  const fields = fieldsState().fields;
  const fieldIndex = getFieldIndex(field);

  fields[fieldIndex] = {
    ...field,
    status: { ...field.status, mortgaged: 0 },
  };
  updateAllFields(fields);

  const transactionId = nanoid(4);
  setTransactionEvent({
    sum: field.price.buyoutPrice,
    reason: `Unmortgage field ${field.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: player.userId,
  });
  transactMoneyEvent(transactionId);
};

export const fieldsState = () => fieldsStore.getState();
