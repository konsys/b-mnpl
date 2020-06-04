import { playersStore, setPlayersEvent } from 'src/stores/players.store';
import {
  IPlayer,
  IMoneyTransaction,
  OutcomeMessageType,
} from 'src/types/board.types';
import { JAIL_POSITION, UN_JAIL_PRICE, JAIL_TURNS } from './board.params.utils';
import nanoid from 'nanoid';
import { setCurrentActionsEvent } from 'src/stores/actions.store';

export const getPlayerById = (userId: number): IPlayer => {
  return playersStore.getState().players.find(v => v.userId === userId);
};

export const getActingPlayer = (): IPlayer => {
  const state = playersStore.getState();
  const user =
    state.players &&
    state.players.length &&
    state.players.find(v => v.isActing);
  return user;
};

export const getActingPlayerIndex = (): number => {
  const state = playersStore.getState();
  const index =
    state.players &&
    state.players.length &&
    state.players.findIndex(v => v.isActing);
  return index;
};

export const getPlayerIndexById = (userId: number) => {
  const state = playersStore.getState();
  return (
    state.players &&
    state.players.length &&
    state.players.findIndex(v => v.userId === userId)
  );
};

export const updatePlayer = (player: IPlayer): boolean => {
  const playersState = playersStore.getState();
  const currentPLayerIndex = getPlayerIndexById(player.userId);

  // TODO error handler
  if (currentPLayerIndex === -1) throw Error('Not found');

  playersState.players[currentPLayerIndex] = player;

  return updateAllPLayers(playersState.players);
};

export const updateAllPLayers = (players: IPlayer[]): boolean => {
  let version = playersStore.getState().version;
  setPlayersEvent({
    version: ++version,
    players,
  });
  return true;
};

export const moneyTransaction = (transaction: IMoneyTransaction): boolean => {
  const player1 = getPlayerById(transaction.userId);
  const player2 = transaction.toUserId
    ? getPlayerById(transaction.toUserId)
    : 0;
  // TODO error handler
  if (player1.money < transaction.sum) throw Error('No money');

  return (
    updatePlayer({ ...player1, money: player1.money + transaction.sum }) &&
    player2 &&
    updatePlayer({ ...player2, money: player2.money - transaction.sum })
  );
};

export const unjailPlayer = () => {
  const player = getActingPlayer();
  // After clicking unjail for manoey till show roll dices modal
  setCurrentActionsEvent({
    action: OutcomeMessageType.DO_NOTHING,
    actionId: nanoid(4),
    moveId: 1,
    userId: getActingPlayer().userId,
  });

  return updatePlayer({
    ...player,
    money: player.money - UN_JAIL_PRICE,
    meanPosition: JAIL_POSITION,
    jailed: 0,
    unjailAttempts: 0,
  });
};

export const goToJail = (): boolean => {
  const player = getActingPlayer();
  return updatePlayer({
    ...player,
    jailed: JAIL_TURNS,
    unjailAttempts: 0,
    doublesRolledAsCombo: 0,
    movesLeft: 0,
    meanPosition: JAIL_POSITION + 1,
  });
};
