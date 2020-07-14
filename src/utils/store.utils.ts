import { combine } from 'effector';
import { actionsStore } from 'src/stores/actions.store';
import { fieldsStore } from 'src/stores/fields.store';

export const getPlayerActionFieldStore = () =>
  combine(actionsStore, fieldsStore);
