import { getActingPlayer } from './users.utils';
import { getActingField, getFieldById, groupHasBranches } from './fields.utils';
import { FieldType } from 'src/entities/board.fields.entity';
import { dicesStore } from 'src/stores/dices.store';

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
