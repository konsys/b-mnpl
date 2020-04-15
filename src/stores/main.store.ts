import { combine } from 'effector';
import { actionsStore } from './actions.store';
import { playersStore } from './players.store';
import { fieldsStore } from './fields.store';
import { dicesStore } from './dices.store';

export const boardStore = combine(
  actionsStore,
  playersStore,
  fieldsStore,
  dicesStore,
);

export enum StoreIndex {
  actionsStore = 0,
  playersStore = 1,
  fieldsStore = 2,
  dices = 3,
}
