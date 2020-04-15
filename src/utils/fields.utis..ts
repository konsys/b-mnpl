import { fieldsStore } from 'src/stores/fields.store';

export const findFieldByPosition = (fieldPosition: number) => {
  const fields = fieldsStore.getState();
  return fields.find(v => v.fieldPosition === fieldPosition);
};

export const findBoughtFields = () => {
  return fieldsStore.getState().filter(v => v.owner > 0);
};
