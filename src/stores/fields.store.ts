import { GameDomain } from 'src/stores/actions.store';
import {} from 'src/entities/board.fields.entity';
import { IField } from 'src/types/Board/board.types';

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetFieldsEvent = FieldsDomain.event();

export interface IFieldsStore {
  version: number;
  fields: IField[];
}
export const setFieldsEvent = FieldsDomain.event<IFieldsStore>();

export const fieldsStore = FieldsDomain.store<IFieldsStore>({
  version: 0,
  fields: [],
})
  .on(setFieldsEvent, (_, data) => data)
  .reset(resetFieldsEvent);

// fieldsStore.updates.watch((v) =>
//   console.log('fieldsStore', v.fields && v.fields[1]),
// );
