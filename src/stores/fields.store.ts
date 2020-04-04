import { GameDomain } from 'src/stores/actions.store';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetFieldsEvent = FieldsDomain.event();

export const setFieldsEvent = FieldsDomain.event<BoardFieldsEntity[] | null>();

export const fieldsStore = FieldsDomain.store<BoardFieldsEntity[] | null>(null)
  .on(setFieldsEvent, (_, data) => data)
  .reset(resetFieldsEvent);

// fieldsStore.watch(v => console.log('fieldsStore', v));
