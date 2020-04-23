import { combine } from 'effector';
import { playersStore } from 'src/stores/players.store';
import { actionsStore } from 'src/stores/actions.store';
import { fieldsStore } from 'src/stores/fields.store';

export const getPlayerActionFieldStore = () =>
  combine(playersStore, actionsStore, fieldsStore);
