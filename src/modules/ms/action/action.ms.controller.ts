import {
  IGameActionRequest,
  IPlayer,
  IncomeMessageType,
} from 'src/types/board/board.types';
import { MessagePattern, RpcException } from '@nestjs/microservices';

import { BoardMessageService } from './board.message.service';
import { Controller } from '@nestjs/common';
import { ErrorCode } from 'src/utils/error.code';
import { IncomeMessageService } from './income-message.service';
import { MsActionsPatterns } from 'src/types/ms/ms.types';
import { StoreService } from './store.service';

@Controller('action')
export class ActionMsController {
  constructor(
    private readonly service: IncomeMessageService,
    private readonly message: BoardMessageService,
    private readonly store: StoreService,
  ) {}

  @MessagePattern({ cmd: MsActionsPatterns.INIT_PLAYERS })
  async initPlayers({
    gameId,
    players,
  }: {
    gameId: string;
    players: IPlayer[];
  }) {
    const splitted = gameId.split('-');
    if (splitted.length < 2) {
      throw new RpcException({ code: ErrorCode.WrongRoomId });
    }
    console.log();
    const isInitialized = await this.message.initStores(gameId);

    let res = [];
    if (!isInitialized) {
      res = await this.message.initPlayers(gameId, players);
    } else {
      res = (await this.store.getPlayersStore(gameId)).players;
    }
    await this.store.emitBoardMessage(gameId);
    return res;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(data: IGameActionRequest) {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    console.log(data, gameId);
    await this.service.dicesModal(gameId, data.userId);
    return { code: 0 };
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED })
  async fieldBought(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );

    await this.service.fieldBought(gameId, data.userId);

    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED })
  async fieldAuction(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.fieldAuction(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED })
  async acceptAuction(data: IGameActionRequest): Promise<any> {
    console.log(111111111, data);
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.acceptAuction(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED })
  async declineAuction(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.declineAuction(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED })
  async payment(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.payment(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED })
  async unJailPayment(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.unJailPayment(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED })
  async mortgageField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.mortgageField(gameId, data.userId, data.fieldId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED })
  async unMortgageField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.unMortgageField(gameId, data.userId, data.fieldId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED })
  async levelUpField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.levelUpField(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED })
  async levelDownField(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.levelDownField(gameId, data.userId);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_CONTRACT_START })
  async contractStart(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.contractStart(gameId, data.userId, data.contract);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_CONTRACT_ACCEPT })
  async contractAccept(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.contractAccept(gameId, data.userId, data.contract);
    return await this.store.emitBoardMessage(gameId);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_CONTRACT_DECLINE })
  async contractDecline(data: IGameActionRequest): Promise<any> {
    const gameId = await this.store.getGameIdByPlayerId(
      data.gameId,
      data.userId,
    );
    await this.service.contractDecline(gameId, data.userId, data.contract);
    return await this.store.emitBoardMessage(gameId);
  }
}
