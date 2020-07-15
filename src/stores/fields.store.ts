import { GameDomain } from 'src/stores/actions.store';
import {} from 'src/entities/board.fields.entity';
import { IField } from 'src/types/Board/board.types';
import { getFieldActions } from 'src/utils/fields.utils';

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetFieldsEvent = FieldsDomain.event();
export const updateFieldActionsEvent = FieldsDomain.event();

export const setFieldsEvent = FieldsDomain.event<IFieldsStore>();

export const fieldsStore = FieldsDomain.store<IFieldsStore>({
  version: 0,
  fields: [],
})
  .on(setFieldsEvent, (_, data) => data)
  .on(updateFieldActionsEvent, (prev) => {
    const fields = prev.fields.map((v) => {
      return (
        (v.status &&
          v.status.fieldActions && {
            ...v,
            status: { ...v.status, fieldActions: getFieldActions(v.fieldId) },
          }) ||
        v
      );
    });
    return { version: ++prev.version, fields };
  })
  .reset(resetFieldsEvent);

// fieldsStore.updates.watch((v) =>
//   console.log('fieldsStore', v.fields && v.fields[1]),
// );
