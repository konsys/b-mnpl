import { IPlayer, IncomeMessageType } from 'src/types/board/board.types';

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
  async rollDices({ userId }: { userId: number }) {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.dicesModal(gameId, userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED })
  async fieldBought({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);

    await this.service.fieldBought(gameId, userId);

    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED })
  async fieldAuction({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.fieldAuction(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED })
  async acceptAuction({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.acceptAuction(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED })
  async declineAuction({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.declineAuction(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED })
  async payment({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.payment(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED })
  async unJailPayment({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.unJailPayment(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED })
  async mortgageField({
    userId,
    fieldId,
  }: {
    userId: number;
    fieldId: number;
  }): Promise<any> {
    console.log(111, fieldId);
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.mortgageField(gameId, userId, fieldId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED })
  async unMortgageField({
    userId,
    fieldId,
  }: {
    userId: number;
    fieldId: number;
  }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.unMortgageField(gameId, userId, fieldId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED })
  async levelUpField({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.levelUpField(gameId, userId);
    return await this.store.emitMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED })
  async levelDownField({ userId }: { userId: number }): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.levelDownField(gameId, userId);
    return await this.store.emitMessage(gameId);
  }
}
