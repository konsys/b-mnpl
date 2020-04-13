import { playersStore } from 'src/stores/players.store';

export const getActingUser = () => {
  const state = playersStore.getState();
  const user = state && state.find(v => v.isActing);
  return user;
};
