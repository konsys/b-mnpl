import { ShowModal, BoardActionType } from 'src/types/board.types';
import nanoid from 'nanoid';
import { setCurrentActionsEvent, actionsStore } from 'src/stores/actions.store';
import { IGameModel } from 'src/types/game.types';
import { playersStore } from 'src/stores/players.store';

export const rollDicesHandler = (payload: IGameModel): ShowModal => {
  let userId = 0;
  playersStore.watch(v => {
    // console.log();
    userId = v.find(v => v.isActing === true)?.userId;
  });

  setCurrentActionsEvent({
    userId,
    action: BoardActionType.SHOW_MODAL,
    srcOfChange: 'rollDicesHandler',
  });

  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: nanoid(4),
  };
};

export const canBuyModal = (userId: number): ShowModal => {
  return {
    type: BoardActionType.SHOW_MODAL,
    userId,
    title: 'Купить поле',
    text: 'Вы можете купить поле или поставить его на аукцион',
    _id: nanoid(4),
  };
};
