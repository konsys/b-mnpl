import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import {
  IField,
  IMoneyTransaction,
  IPlayer,
  IFieldAction,
} from 'src/types/Board/board.types';
import { getActingPlayer } from './users.utils';
import _ from 'lodash';
import { BOARD_PARAMS } from '../params/board.params';
import { FieldType } from 'src/entities/board.fields.entity';

import { nanoid } from 'nanoid';
import {
  setTransactionEvent,
  transactMoneyEvent,
} from 'src/stores/transactions.store';
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

export const moneyTransactionParams = (): IMoneyTransaction => {
  const field = getActingField();
  return {
    sum: -field.price,
    userId: getActingPlayer().userId,
    toUserId: (field.status && field.status.userId) || 0,
  };
};

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

export const getPlayerGroupFields = (
  field: IField,
  player: IPlayer,
): IField[] =>
  fieldsState().fields.filter(
    (v) =>
      v.fieldGroup === field.fieldGroup &&
      v.status &&
      v.status.userId === player.userId,
  );

export const getFieldsByGroup = (group: number) =>
  fieldsState().fields.filter((v: IField) => v.fieldGroup === group);

export const getNotMortgagedFieldsByGroup = (group: number, user: IPlayer) =>
  fieldsState().fields.filter(
    (v: IField) =>
      v.fieldGroup === group &&
      v.status &&
      v.status.mortgaged === 0 &&
      user.userId === v.status.userId,
  );

export const buyCompany = (field: IField): number => {
  const user = getActingPlayer();

  const sameGroup = _.concat(getPlayerGroupFields(field, user), field);
  const group = getFieldsByGroup(field.fieldGroup);
  const fieldActions = [];

  const notMortgagedGroup = getNotMortgagedFieldsByGroup(
    field.fieldGroup,
    user,
  );

  group.length === sameGroup.length &&
    sameGroup.length === notMortgagedGroup.length + 1 &&
    fieldActions.push(IFieldAction.LEVEL_UP);

  sameGroup.map((v: IField) => {
    v.status = {
      fieldId: v.fieldId,
      userId: user.userId,
      branches: 0,
      mortgaged: v.status.mortgaged || 0,
      fieldActions: _.concat(fieldActions, [
        v.status.mortgaged > 0
          ? IFieldAction.UNMORTGAGE
          : IFieldAction.MORTGAGE,
      ]),
    };
    updateField(v);
  });

  return field.price.startPrice;
};

export const buyITCompany = (field: IField): number => {
  const user = getActingPlayer();

  field.status = {
    fieldId: field.fieldId,
    userId: user.userId,
    branches: 0,
    mortgaged: 0,
  };
  updateField(field);
  return field.price.startPrice;
};

export const mortgage = (fieldId: number): void => {
  const f = getFieldById(fieldId);
  const p = getActingPlayer();
  const groupFields = getPlayerGroupFields(f, p);
  groupFields.map((v) => {
    v.status = {
      ...v.status,
      mortgaged:
        v.fieldId === fieldId
          ? BOARD_PARAMS.MORTGAGE_TURNS
          : v.status.mortgaged,
      fieldActions: [
        v.fieldId === fieldId
          ? IFieldAction.UNMORTGAGE
          : v.status.mortgaged
          ? IFieldAction.UNMORTGAGE
          : IFieldAction.MORTGAGE,
      ],
    };

    updateField(v);
  });

  const transactionId = nanoid(4);
  setTransactionEvent({
    sum: f.price.pledgePrice,
    reason: `Money for pledge ${f.name}`,
    toUserId: p.userId,
    transactionId,
    userId: BOARD_PARAMS.BANK_PLAYER_ID,
  });
  transactMoneyEvent(transactionId);
};

export const mortgageNextRound = () => {
  const fields = fieldsState().fields;
  const res = fields.map((v: IField) => {
    if (v.status && v.status.mortgaged > 1) {
      return { ...v, status: { ...v.status, mortgaged: --v.status.mortgaged } };
    } else if (v.status && v.status.mortgaged === 1) {
      v.status && delete v.status;
    }
    return v;
  });
  return res;
};

export const unMortgage = (fieldId: number): void => {
  const field = getFieldById(fieldId);
  const player = getActingPlayer();

  field.status = {
    ...field.status,
    mortgaged: 0,
    fieldActions: [IFieldAction.MORTGAGE],
  };

  updateField(field);

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

export const levelUpField = (fieldId: number): void => {
  const field = getFieldById(fieldId);
  const player = getActingPlayer();
  field.status = { ...field.status, branches: ++field.status.branches };

  updateField(field);
  const transactionId = nanoid(4);
  setTransactionEvent({
    sum: field.price.branchPrice,
    reason: `Buy branch ${field.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: player.userId,
  });
  transactMoneyEvent(transactionId);
};

export const fieldsState = () => fieldsStore.getState();
