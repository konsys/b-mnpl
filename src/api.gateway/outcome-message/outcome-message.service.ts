import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StoreService } from '../store/store.service';
import {
  OutcomeMessageType,
  IDicesModal,
  IUnJailModal,
  IUnJailPayingModal,
  IDoNothing,
  IShowCanBuyModal,
  IPayRentModal,
  IRollDicesMessage,
  IncomeMessageType,
} from 'src/types/Board/board.types';
import { nanoid } from 'nanoid';
import { FieldsService } from '../fields/fields.service';
import { DicesService } from '../dices/dices.service';

@Injectable()
export class OutcomeMessageService {
  constructor(
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
    private readonly store: StoreService,
    private readonly dices: DicesService,
  ) {}

  rollDicesModalMessage = async (gameId: string): Promise<IDicesModal> => ({
    type: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
    userId: (await this.usersService.getActingPlayer(gameId)).userId,
    title: 'Кидайте кубики',
    text: 'Мы болеем за вас',
    _id: (await this.store.getActionStore(gameId)).actionId,
    isModal: true,
  });

  unJailModalMesage = async (gameId: string): Promise<IUnJailModal> => ({
    type: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
    userId: (await this.usersService.getActingPlayer(gameId)).userId,
    title: 'Заплатить залог',
    text: 'Заплатить за выход из тюрьмы',
    _id: (await this.store.getActionStore(gameId)).actionId,
    isModal: true,
  });

  unJailPayModalMesage = async (
    gameId: string,
  ): Promise<IUnJailPayingModal> => {
    const transaction = await this.store.getTransaction(gameId);
    return {
      type: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.usersService.getActingPlayer(gameId)).userId,
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
    userId: (await this.usersService.getActingPlayer(gameId)).userId,
    isModal: false,
  });

  buyModalHandler = async (gameId: string): Promise<IShowCanBuyModal> => {
    const player = await this.usersService.getActingPlayer(gameId);

    return {
      type: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
      userId: player.userId,
      title: 'Купить поле',
      text: 'Вы можете купить поле или поставить его на аукцион',
      field: await this.fieldsService.findFieldByPosition(
        gameId,
        player.meanPosition,
      ),
      money: player.money,
      _id: (await this.store.getActionStore(gameId)).actionId,
      isModal: true,
    };
  };

  payModalHandler = async (gameId: string): Promise<IPayRentModal> => {
    const player = await this.usersService.getActingPlayer(gameId);
    const field = await this.fieldsService.getActingField(gameId);
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
      toUserId: field.status && field.status.userId,
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
    this.dices.dicesUpdatePlayerToken(gameId, dicesState);

    return {
      type: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: (await this.usersService.getActingPlayer(gameId)).userId,
      dices: dicesState.dices,
      meanPosition: dicesState.meanPosition,
      isDouble: dicesState.isDouble,
      isTriple: dicesState.isTriple,
      _id: action.actionId,
      isModal: false,
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
        return await this.unJailPayModalMesage(gameId);

      case OutcomeMessageType.DO_NOTHING:
        return await this.doNothingMessage(gameId);
    }
  };
}
