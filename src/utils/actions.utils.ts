import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { BoardActionType, IPlayer, IField } from 'src/types/board.types';
import nanoid from 'nanoid';
import { fieldsStore, setFieldsEvent } from 'src/stores/fields.store';
import { getFieldIndex, findFieldByPosition } from './fields.utis.';
import { getActingPlayer, getActingPlayerIndex } from './users.utils';
import { playersStore, setPlayersEvent } from 'src/stores/players.store';

export const buyFieldModalAction = (): void => {
  const player = getActingPlayer();
  const action = actionsStore.getState();
  setCurrentActionsEvent({
    action: BoardActionType.CAN_BUY,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesMessage dices buy',
  });
};

export const buyFieldAction = (): void => {
  // Field set to player
  const user = getActingPlayer();
  const field = findFieldByPosition(user.meanPosition);
  const fieldIndex = getFieldIndex(field);
  const fields = fieldsStore.getState();
  field.owner = {
    fieldId: field.fieldId,
    userId: user.userId,
    level: 0,
    mortgaged: false,
  };
  fields[fieldIndex] = field;
  setFieldsEvent(fields);

  // Decrease player`s money
  const players = playersStore.getState();
  const playerIndex = players.findIndex(v => v.userId === user.userId);
  players[playerIndex] = { ...user, money: user.money - field.price };
  setPlayersEvent(players);
};

export const rollDicesAction = (): void => {
  const action = actionsStore.getState();
  const player = getActingPlayer();
  setCurrentActionsEvent({
    action: BoardActionType.ROLL_DICES_MODAL,
    userId: player.userId,
    actionId: nanoid(4),
    moveId: action.moveId + 1,
    srcOfChange: 'rollDicesMessage dices roll',
  });
};
