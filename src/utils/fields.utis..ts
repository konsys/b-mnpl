import { fieldsStore } from 'src/stores/fields.store';
import { IPlayer, IField } from 'src/types/board.types';

export const findFieldByPosition = (fieldPosition: number) => {
  const fields = fieldsStore.getState();
  return fields.find(v => v.fieldPosition === fieldPosition);
};

export const findBoughtFields = () => {
  const f = fieldsStore
    .getState()
    .filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);
  return f;
};

export const canBuyField = (user: IPlayer, field: IField): boolean =>
  field && field.price && !field.owner;
