import {
  IAuctionModal,
  IContractModal,
  IDicesModal,
  IDoNothing,
  IPayRentModal,
  IRollDicesMessage,
  IShowCanBuyModal,
  IUnJailModal,
  IUnJailPayingModal,
  IncomeMessageType,
  OutcomeMessageType,
} from 'src/types/board/board.types';

import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { DicesService } from './dices.service';
import { FieldsUtilsService } from './fields.utils.service';
import { Injectable } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { nanoid } from 'nanoid';

@Injectable()
export class OutcomeMessageService {
  constructor(
    private readonly fields: FieldsUtilsService,
    private readonly store: StoreService,
    private readonly dices: DicesService,
    private readonly players: PlayersUtilsService,
    private readonly actions: ActionService,
  ) {}

  rollDicesModalMessage = async (gameId: string): Promise<IDicesModal> => ({
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: (await this.players.getActingPlayer(gameId)).userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: (await this.store.getActionStore(gameId)).actionId,
    isModal: true,
  });

  unJailModalMesage = async (gameId: string): Promise<IUnJailModal> => {
    return {
      type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      title: 'Заплатить залог',
      text: 'Заплатить за выход из тюрьмы',
      _id: (await this.store.getActionStore(gameId)).actionId,
      isModal: true,
      money: BOARD_PARAMS.UN_JAIL_PRICE,
    };
  };

  unjailForMoney = async (gameId: string): Promise<IUnJailPayingModal> => {
    const transaction = await this.store.getTransaction(gameId);
    return {
      type: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      title: 'Заплатить залог',
      text: 'Заплатить за выход из тюрьмы',
      _id: (await this.store.getActionStore(gameId)).actionId,
      isModal: true,
      money: (transaction && transaction.sum) || 0,
    };
  };

  doNothingMessage = async (gameId: string): Promise<IDoNothing> => ({
    type: OutcomeMessageType.DO_NOTHING,
    _id: nanoid(),
    userId: (await this.players.getActingPlayer(gameId)).userId,
    isModal: false,
  });

  buyModalHandler = async (gameId: string): Promise<IShowCanBuyModal> => {
    const player = await this.players.getActingPlayer(gameId);

    return {
      type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
      userId: player.userId,
      title: 'Купить поле',
      text: 'Вы можете купить поле или поставить его на аукцион',
      field: await this.fields.getFieldByPosition(gameId, player.meanPosition),
      money: player.money,
      _id: (await this.store.getActionStore(gameId)).actionId,
      isModal: true,
    };
  };

  payModalHandler = async (gameId: string): Promise<IPayRentModal> => {
    const player = await this.players.getActingPlayer(gameId);
    const field = await this.fields.getFieldByPosition(
      gameId,
      player.meanPosition,
    );
    const action = await this.store.getActionStore(gameId);
    const transaction = await this.store.getTransaction(gameId);
    const sum = (transaction && transaction.sum) || 0;

    return {
      type: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
      userId: player.userId,
      title: 'Заплатить',
      text: `${transaction && transaction.reason + '. '}`,
      field: field,
      money: sum,
      toUserId:
        (field.status && field.status.userId) || BOARD_PARAMS.BANK_PLAYER_ID,
      _id: action.actionId,
      isModal: true,
    };
  };

  rollDicesMessage = async (
    gameId: string,
  ): Promise<IRollDicesMessage | IDoNothing> => {
    const action = await this.store.getActionStore(gameId);
    const dicesState = await this.dices.randDices(gameId, action.actionId);
    await this.store.setDicesStore(gameId, dicesState);

    await this.dices.dicesUpdatePlayerToken(gameId, dicesState);

    return {
      type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      dices: dicesState.dices,
      meanPosition: dicesState.meanPosition,
      isDouble: dicesState.isDouble,
      isTriple: dicesState.isTriple,
      _id: action.actionId,
      isModal: false,
    };
  };

  auctionMessage = async (gameId: string): Promise<IAuctionModal> => {
    const action = await this.actions.getAction(gameId);
    const field = await this.fields.getActingField(gameId);
    const auction = await this.store.getAuctionStore(gameId);

    return {
      type: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      _id: nanoid(),
      userId: action.userId,
      title: 'Аукцион начался',
      text: `Поле ${field.name} выставлено на аукцион. Цена ${auction.bet}$`,
      field,
      bet: auction.bet,
      isModal: true,
    };
  };

  contractMessage = async (gameId: string): Promise<IContractModal> => {
    const contract = await this.store.getContractStore(gameId);
    const auction = await this.store.getAuctionStore(gameId);

    return {
      type: OutcomeMessageType.OUTCOME_CONTRACT_MODAL,
      _id: nanoid(),
      userId: auction.userId,
      isModal: true,
      contract,
    };
  };

  // When emit message action store to action message adapter
  actionTypeToEventAdapter = async (
    gameId: string,
    type: OutcomeMessageType | IncomeMessageType,
  ) => {
    switch (type) {
      case OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL:
        return await this.rollDicesModalMessage(gameId);

      case OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION:
        return await this.rollDicesMessage(gameId);

      case OutcomeMessageType.OUTCOME_CAN_BUY_MODAL:
        return await this.buyModalHandler(gameId);

      case OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL:
        return await this.payModalHandler(gameId);

      case OutcomeMessageType.OUTCOME_UN_JAIL_MODAL:
        return await this.unJailModalMesage(gameId);

      case OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL:
        return await this.unjailForMoney(gameId);

      case OutcomeMessageType.DO_NOTHING:
        return await this.doNothingMessage(gameId);

      case OutcomeMessageType.OUTCOME_AUCTION_MODAL:
        return await this.auctionMessage(gameId);

      case OutcomeMessageType.OUTCOME_CONTRACT_MODAL:
        return await this.contractMessage(gameId);
    }
  };
}
