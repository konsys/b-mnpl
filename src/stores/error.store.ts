import { GameDomain } from 'src/stores/actions.store';
import {} from 'src/entities/board.fields.entity';
import { IField } from 'src/types/Board/board.types';

export interface IErrorMessage {
  code: number;
  message: string;
}
const ErrorDomain = GameDomain.domain('FieldsDomain');
export const resetError = ErrorDomain.event();

export const setError = ErrorDomain.event<IErrorMessage>();

export const errorStore = ErrorDomain.store<IErrorMessage | null>(null)
  .on(setError, (_, error) => error)
  .reset(resetError);

// fieldsStore.watch(v => console.log('fieldsStore', v));
