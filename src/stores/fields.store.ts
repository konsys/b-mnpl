import { GameDomain } from 'src/stores/actions.store';
import {} from 'src/entities/board.fields.entity';
import { IField } from 'src/types/board.types';

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetFieldsEvent = FieldsDomain.event();

export const setFieldsEvent = FieldsDomain.event<IField[] | null>();

export const fieldsStore = FieldsDomain.store<IField[] | null>(null)
  .on(setFieldsEvent, (_, data) => data)
  .reset(resetFieldsEvent);

// fieldsStore.watch(v => console.log('fieldsStore', v));
