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
    console.log('rollDices', userId);
    const gameId = await this.store.getGameIdByPlayerId(userId);

    await this.service.dicesModal(userId);
    // return;
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED })
  async fieldBought({ userId }: { userId: number }): Promise<any> {
    console.log('fieldBought');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.fieldBought(userId);

    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED })
  async fieldAuction({ userId }: { userId: number }): Promise<any> {
    console.log('fieldAuction');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.fieldAuction(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED })
  async acceptAuction({ userId }: { userId: number }): Promise<any> {
    console.log('acceptAuction');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.acceptAuction(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED })
  async declineAuction({ userId }: { userId: number }): Promise<any> {
    console.log('declineAuction');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.declineAuction(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED })
  async payment({ userId }: { userId: number }): Promise<any> {
    console.log('payment');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.payment(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED })
  async unJailPayment({ userId }: { userId: number }): Promise<any> {
    console.log('unJailPayment');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.unJailPayment(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED })
  async mortgageField({ userId }: { userId: number }): Promise<any> {
    console.log('mortgageField');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.mortgageField(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED })
  async unMortgageField({ userId }: { userId: number }): Promise<any> {
    console.log('unMortgageField');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.unMortgageField(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED })
  async levelUpField({ userId }: { userId: number }): Promise<any> {
    console.log('levelUpField');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.levelUpField(userId);
    return;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED })
  async levelDownField({ userId }: { userId: number }): Promise<any> {
    console.log('levelDownField');
    const gameId = await this.store.getGameIdByPlayerId(userId);
    await this.service.levelDownField(userId);
    return;
  }
}
