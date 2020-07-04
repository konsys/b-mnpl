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

const getSameGroupFields = (field: IField, player: IPlayer): IField[] => {
  const fields = fieldsState().fields;
  return _.concat(
    fields.filter(
      (v) =>
        v.fieldGroup === field.fieldGroup &&
        v.status &&
        v.status.userId === player.userId,
    ),
    field,
  );
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

export const groupHasBranches = (f: IField): boolean =>
  getFieldsByGroup(f.fieldGroup).filter(
    (v) => v.status && v.status.branches > 0,
  ).length > 0;

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

export const canMortgage = (fieldId: number): boolean => {
  const f = getFieldById(fieldId);
  const p = getActingPlayer();
  const hasBranches = groupHasBranches(f);
  return (
    f &&
    isCompany(fieldId) &&
    f.status &&
    f.status.mortgaged === 0 &&
    !hasBranches
  );
};

export const buyCompany = (field: IField): number => {
  const user = getActingPlayer();

  const sameGroup = getSameGroupFields(field, user);

  const fieldActions = [IFieldAction.MORTGAGE];

  const notMortgagedGroup = getNotMortgagedFieldsByGroup(
    field.fieldGroup,
    user,
  );
  sameGroup.length === notMortgagedGroup.length + 1 &&
    fieldActions.push(IFieldAction.LEVEL_UP);

  sameGroup.map((v) => {
    v.status = {
      fieldId: v.fieldId,
      userId: user.userId,
      branches: 0,
      mortgaged: 0,
      sameGroup: sameGroup.length,
      fieldActions,
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
    sameGroup: getSameGroupFields(field, user).length,
    mortgaged: 0,
  };
  updateField(field);
  return field.price.startPrice;
};

export const mortgage = (fieldId: number): void => {
  const field = getFieldById(fieldId);
  const player = getActingPlayer();
  field.status = {
    ...field.status,
    mortgaged: BOARD_PARAMS.MORTGAGE_TURNS,
    fieldActions: [IFieldAction.UNMORTGAGE],
  };

  updateField(field);

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
