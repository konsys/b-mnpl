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

    await this.service.dicesModal(userId);
    return await this.message.createBoardMessage(gameId);
  }
}
