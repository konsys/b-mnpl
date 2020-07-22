import { BoardMessageService } from './board.message.service';
import { Controller } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';
import { IncomeMessageType } from 'src/types/board/board.types';
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
  async initPlayers(params: any) {
    const res = await this.message.initPlayers(params.gameId, params.players);
    await this.store.emitMessage(params.gameId);
    return res;
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(gameId: string) {
    await this.service.dicesModal(gameId);
    return await this.message.createBoardMessage(gameId);
  }
}
