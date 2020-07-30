import {
  IGameActionRequest,
  IPlayer,
  IncomeMessageType,
} from 'src/types/board/board.types';

import { BoardMessageService } from './board.message.service';
import { Controller } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';
import { MessagePattern } from '@nestjs/microservices';
import { MsPatternsActions } from 'src/types/ms/ms.types';
import { StoreService } from './store.service';

@Controller('action')
export class ActionMsController {
  constructor(
    private readonly service: IncomeMessageService,
    private readonly message: BoardMessageService,
    private readonly store: StoreService,
  ) {}

  @MessagePattern({ cmd: MsPatternsActions.INIT_PLAYERS })
  async initPlayers({
    gameId,
    players,
  }: {
    gameId: string;
    players: IPlayer[];
  }) {
    await this.message.initStores(gameId);
    const res = await this.message.initPlayers(gameId, players);
    await this.store.emitMessage(gameId);
    return res;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(data: IGameActionRequest) {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.dicesModal(gameId, data.userId);
    return { code: 0 };
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED })
  async fieldBought(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);

    await this.service.fieldBought(gameId, data.userId);

    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED })
  async fieldAuction(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.fieldAuction(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED })
  async acceptAuction(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.acceptAuction(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED })
  async declineAuction(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.declineAuction(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED })
  async payment(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.payment(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED })
  async unJailPayment(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.unJailPayment(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED })
  async mortgageField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.mortgageField(gameId, data.userId, data.fieldId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED })
  async unMortgageField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.unMortgageField(gameId, data.userId, data.fieldId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED })
  async levelUpField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.levelUpField(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED })
  async levelDownField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.levelDownField(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_CONTRACT_START })
  async contractStart(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(data.userId);
    await this.service.levelDownField(gameId, data.userId);
    return await this.store.emitMessage(gameId);
  }
}
