import { GameDomain } from 'src/stores/board.action.store';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

const FieldsDomain = GameDomain.domain('FieldsDomain');
export const resetPlayersEvent = FieldsDomain.event();

export const setPlayersEvent = FieldsDomain.event<BoardFieldsEntity[] | null>();

export const playersStore = FieldsDomain.store<BoardFieldsEntity[] | null>(null)
  .on(setPlayersEvent, (_, data) => data)
  .reset(resetPlayersEvent);
