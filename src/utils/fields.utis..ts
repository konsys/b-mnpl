import { fieldsStore } from 'src/stores/fields.store';

export const findFieldByPosition = (fieldPosition: number) => {
  const fields = fieldsStore.getState();
  return fields.find(v => v.fieldPosition === fieldPosition);
};

export const findBoughtFields = () => {
  const f = fieldsStore
    .getState()
    .filter(v => v.owner && v.owner.userId > 0)
    .map(v => v.owner);
  console.log(234242234242, f);
  return f;
};

// owner: number;
// level: number;
// stars: number;
