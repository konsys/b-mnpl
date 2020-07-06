import { getActingPlayer } from './users.utils';
import {
  getActingField,
  getFieldById,
  getPlayerGroupFields,
  getFieldsByGroup,
} from './fields.utils';
import { FieldType } from 'src/entities/board.fields.entity';
import { dicesStore } from 'src/stores/dices.store';
import { BOARD_PARAMS } from 'src/params/board.params';
import { IPlayer, IField, IFieldAction } from 'src/types/Board/board.types';
import { boardStore } from 'src/stores/board.store';

export const isTax = (): boolean => getActingField().type === FieldType.TAX;

export const isStartPass = (): boolean => {
  const dices = dicesStore.getState();
  const player = getActingPlayer();

  return dices.sum > 0 && player.meanPosition - dices.sum < 0;
};
export const isJail = (): boolean => getActingField().type === FieldType.JAIL;

export const isFieldMortgaged = (fieldId: number): boolean => {
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

export const isCompanyForSale = (fieldId: number): boolean =>
  isCompany(getActingField().fieldId) &&
  getFieldById(fieldId) &&
  !getFieldById(fieldId).status;

export const isMyField = (fieldId: number): boolean => {
  const field = getFieldById(fieldId);
  return (
    isCompany(fieldId) &&
    field.status &&
    field.status.userId === getActingPlayer().userId
  );
};

export const canBuyField = (fieldId: number, p: IPlayer): boolean =>
  isCompany(fieldId) && getFieldById(fieldId).price.startPrice <= p.money;

export const whosField = (): number =>
  (getActingField().status && getActingField().status.userId) ||
  BOARD_PARAMS.BANK_PLAYER_ID;

export const noActionField = (): boolean => {
  const field = getActingField();
  return field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO;
};

export const playerHasMonopoly = (f: IField, p: IPlayer): boolean => {
  const sg = getPlayerGroupFields(f, p);
  const pg = getFieldsByGroup(f.fieldGroup);
  return sg.length === pg.length;
};

export const isGroupMortgaged = (f: IField): boolean => {
  const p = getActingPlayer();
  const sg = getPlayerGroupFields(f, p);
  return sg.some((v) => v.status && v.status.mortgaged > 0);
};

export const groupHasBranches = (f: IField): boolean =>
  getFieldsByGroup(f.fieldGroup).some((v) => v.status && v.status.branches > 0);

export const canMortgage = (fieldId: number): boolean => {
  const f = getFieldById(fieldId);
  const hasBranches = groupHasBranches(f);

  return (
    f &&
    isCompany(fieldId) &&
    f.status &&
    f.status.mortgaged === 0 &&
    !hasBranches
  );
};

export const canUnMortgage = (fieldId: number): boolean => {
  const f = getFieldById(fieldId);
  const p = getActingPlayer();
  return (
    f &&
    isCompany(fieldId) &&
    f.status &&
    f.status.mortgaged > 0 &&
    f.status.userId === p.userId
  );
};

export const canLevelUp = (fieldId: number): boolean => {
  const f = getFieldById(fieldId);
  const p = getActingPlayer();
  const m = playerHasMonopoly(f, p);
  const isMortgaged = isGroupMortgaged(f);

  const group = getFieldsByGroup(f.fieldGroup);
  const branches = group.map((v) => v.status.branches);
  const max = Math.max(...branches);
  const min = Math.min(...branches);
  const boardState = boardStore.getState();
  const alreadyUp = boardState.playerActions.some(
    (v) =>
      v.fieldGroup === f.fieldGroup && v.fieldAction === IFieldAction.LEVEL_UP,
  );
  const byOrder = BOARD_PARAMS.BRANCHES.BUILD_QEUEU
    ? max > min
      ? f.status.branches === min
        ? true
        : false
      : true
    : true;

  return (
    f &&
    p.money > f.price.branchPrice &&
    f.type === FieldType.COMPANY &&
    f.status &&
    m &&
    !isMortgaged &&
    !alreadyUp &&
    f.status.branches <= 4 &&
    byOrder
  );
};

export const canLevelDown = (fieldId: number): boolean => {
  const f = getFieldById(fieldId);
  const p = getActingPlayer();
  const hasMonopoly = playerHasMonopoly(f, p);
  const isMortgaged = isGroupMortgaged(f);

  const group = getFieldsByGroup(f.fieldGroup);
  const branches = group.map((v) => v.status.branches);
  const max = Math.max(...branches);
  const min = Math.min(...branches);
  const byOrder = BOARD_PARAMS.BRANCHES.BUILD_QEUEU
    ? max > min
      ? f.status.branches === max
        ? true
        : false
      : true
    : true;

  return (
    f &&
    isCompany(fieldId) &&
    f.status &&
    hasMonopoly &&
    !isMortgaged &&
    f.type === FieldType.COMPANY &&
    f.status.branches > 0 &&
    byOrder
  );
};
