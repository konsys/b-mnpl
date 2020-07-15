import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import {
  IField,
  IMoneyTransaction,
  IPlayer,
  IFieldAction,
} from 'src/types/Board/board.types';
import _ from 'lodash';
import { BOARD_PARAMS } from '../params/board.params';

import { nanoid } from 'nanoid';
import { setTransaction, transactMoney } from 'src/stores/transactions.store';
import {
  canLevelUp,
  canMortgage,
  canUnMortgage,
  canLevelDown,
  canBuyField,
} from './checks.utils';
import { FieldType } from 'src/entities/board.fields.entity';
import { setPlayerActionEvent } from 'src/stores/board.store';
import { dicesStore } from 'src/stores/dices.store';

export const findFieldByPosition = (fieldPosition: number) =>
  fieldsState().fields.find((v) => v.fieldPosition === fieldPosition);

export const getActingField = async (gameId: string): Promise<IField> => {
  const user = await getActingPlayer(gameId);
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

export const moneyTransactionParams = async (): Promise<IMoneyTransaction> => {
  const field = await getActingField('kkk');
  const p = await getActingPlayer('kkk');
  return {
    sum: -field.price,
    userId: p.userId,
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

export const getFieldRent = async (field: IField): Promise<number> => {
  if (field && field.rent && field.rent.paymentMultiplier) {
    const group = getPlayerGroupFields(
      field,
      await getPlayerById('kkk', field.status.userId),
    );
    const dices = dicesStore.getState();
    return (
      dices.sum *
      (group.length === 1 ? field.rent.baseRent : field.rent.oneStar)
    );
  }
  if (!field.status || field.status.branches === 0) {
    return field.rent.baseRent;
  }
  if (field.status) {
    if (field.status.branches === 1) {
      return field.rent.oneStar;
    }
    if (field.status.branches === 2) {
      return field.rent.twoStar;
    }
    if (field.status.branches === 3) {
      return field.rent.freeStar;
    }
    if (field.status.branches === 4) {
      return field.rent.fourStar;
    }
    if (field.status.branches === 5) {
      return field.rent.bigStar;
    }
  }

  return 0;
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

export const buyCompany = async (f: IField): Promise<number> => {
  const p = await getActingPlayer('kkk');
  const sameGroup = _.concat(getPlayerGroupFields(f, p), f);

  if (canBuyField(f.fieldId, p)) {
    updateField({
      ...f,

      status: {
        fieldId: f.fieldId,
        userId: p.userId,
        branches: f.type === FieldType.COMPANY ? 0 : sameGroup.length - 1,
        mortgaged: f.status.mortgaged || 0,
        fieldActions: getFieldActions(f.fieldId),
      },
    });
    sameGroup.map((v: IField) => {
      v.status = {
        fieldId: v.fieldId,
        userId: p.userId,
        branches:
          f.type === FieldType.COMPANY
            ? v.status.branches || 0
            : sameGroup.length - 1,
        mortgaged: v.status.mortgaged || 0,
        fieldActions: getFieldActions(v.fieldId),
      };
      updateField(v);
    });
  }
  return f.price.startPrice;
};

export const mortgage = async (fieldId: number): Promise<void> => {
  const f = getFieldById(fieldId);
  const p = await getActingPlayer('kkk');

  setPlayerActionEvent({
    userId: p.userId,
    fieldGroup: f.fieldGroup,
    fieldId: f.fieldId,
    fieldAction: IFieldAction.MORTGAGE,
  });

  canMortgage(f.fieldId) &&
    updateField({
      ...f,
      status: { ...f.status, mortgaged: BOARD_PARAMS.MORTGAGE_TURNS },
    });

  const groupFields = getPlayerGroupFields(f, p);
  groupFields.map((v) => {
    v.status = {
      ...v.status,
      fieldActions: getFieldActions(v.fieldId),
    };

    updateField(v);
  });

  const transactionId = nanoid(4);
  await setTransaction('kkk', {
    sum: f.price.pledgePrice,
    reason: `Money for pledge ${f.name}`,
    toUserId: p.userId,
    transactionId,
    userId: BOARD_PARAMS.BANK_PLAYER_ID,
  });
  await transactMoney('kkk', transactionId);
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

export const getFieldActions = (fieldId: number): IFieldAction[] => {
  if (canMortgage(fieldId) && canLevelUp(fieldId)) {
    return [IFieldAction.MORTGAGE, IFieldAction.LEVEL_UP];
  } else if (canUnMortgage(fieldId)) {
    return [IFieldAction.UNMORTGAGE];
  } else if (canLevelUp(fieldId) && canLevelDown(fieldId)) {
    return [IFieldAction.LEVEL_UP, IFieldAction.LEVEL_DOWN];
  } else if (canLevelDown(fieldId)) {
    return [IFieldAction.LEVEL_DOWN];
  } else if (canMortgage(fieldId)) {
    return [IFieldAction.MORTGAGE];
  } else if (canLevelUp(fieldId)) {
    return [IFieldAction.LEVEL_UP];
  }

  return [];
};

export const unMortgage = async (fieldId: number): Promise<void> => {
  const f = getFieldById(fieldId);
  const p = await getActingPlayer('kkk');

  setPlayerActionEvent({
    userId: p.userId,
    fieldGroup: f.fieldGroup,
    fieldId: f.fieldId,
    fieldAction: IFieldAction.UNMORTGAGE,
  });

  canUnMortgage(f.fieldId) &&
    updateField({
      ...f,
      status: { ...f.status, mortgaged: 0 },
    });

  const groupFields = getPlayerGroupFields(f, p);
  groupFields.map((v) => {
    v.status = {
      ...v.status,
      fieldActions: getFieldActions(v.fieldId),
    };

    updateField(v);
  });

  const transactionId = nanoid(4);
  await setTransaction('kkk', {
    sum: f.price.buyoutPrice,
    reason: `Unmortgage field ${f.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: p.userId,
  });
  await transactMoney('kkk', transactionId);
};

export const levelUpField = async (fieldId: number): Promise<void> => {
  const f = getFieldById(fieldId);
  const p = await getActingPlayer('kkk');

  setPlayerActionEvent({
    userId: p.userId,
    fieldGroup: f.fieldGroup,
    fieldId: f.fieldId,
    fieldAction: IFieldAction.LEVEL_UP,
  });
  updateField({
    ...f,
    status: {
      ...f.status,
      branches: ++f.status.branches,
    },
  });
  const group = getFieldsByGroup(f.fieldGroup);
  group.map((v) => {
    v.status = {
      ...v.status,
      fieldActions: getFieldActions(v.fieldId),
    };
    updateField(v);
  });

  const transactionId = nanoid(4);
  await setTransaction('kkk', {
    sum: f.price.branchPrice,
    reason: `Buy branch ${f.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: p.userId,
  });
  await transactMoney('kkk', transactionId);
};

export const levelDownField = async (fieldId: number): Promise<void> => {
  const f = getFieldById(fieldId);
  const p = await getActingPlayer('kkk');

  setPlayerActionEvent({
    userId: p.userId,
    fieldGroup: f.fieldGroup,
    fieldId: f.fieldId,
    fieldAction: IFieldAction.LEVEL_DOWN,
  });

  canLevelDown(f.fieldId) &&
    updateField({
      ...f,
      status: {
        ...f.status,
        branches: f.status.branches > 0 ? --f.status.branches : 0,
      },
    });
  const group = getFieldsByGroup(f.fieldGroup);
  group.map((v) => {
    v.status = {
      ...v.status,
      fieldActions: getFieldActions(v.fieldId),
    };
    updateField(v);
  });

  const transactionId = nanoid(4);
  await setTransaction('kkk', {
    sum: f.price.branchPrice,
    reason: `Buy branch ${f.name}`,
    toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
    transactionId,
    userId: p.userId,
  });
  transactMoney('kkk', transactionId);
};

export const fieldsState = () => fieldsStore.getState();
