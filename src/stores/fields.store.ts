import { GameDomain } from 'src/stores/actions.store';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { IFieldsStatus } from 'src/types/board.types';

export interface IFields extends BoardFieldsEntity {
  owner?: IFieldsStatus;
}

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetFieldsEvent = FieldsDomain.event();

export const setFieldsEvent = FieldsDomain.event<IFields[] | null>();

export const fieldsStore = FieldsDomain.store<IFields[] | null>(null)
  .on(setFieldsEvent, (_, data) => data)
  .reset(resetFieldsEvent);

// fieldsStore.watch(v => console.log('fieldsStore', v));
