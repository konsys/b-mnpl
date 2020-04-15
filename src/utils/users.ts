import { playersStore } from 'src/stores/players.store';
import { fieldsStore } from 'src/stores/fields.store';

export const getActingPlayer = () => {
  const state = playersStore.getState();
  const user = state && state.find(v => v.isActing);
  return user;
};
export const getActingPlayerIndex = () => {
  const state = playersStore.getState();
  const index = state && state.findIndex(v => v.isActing);
  return index;
};
export const getField = (fieldPosition: number) => {
  const fields = fieldsStore.getState();
  return fields.find(v => v.fieldPosition === fieldPosition);
};
