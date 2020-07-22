import { BoardMessageService } from './board.message.service';
import { Controller } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';
import { IncomeMessageType } from 'src/types/board/board.types';
import { MessagePattern } from '@nestjs/microservices';
import { MsPatternsActions } from 'src/types/ms/ms.types';

@Controller('action')
export class ActionMsController {
  constructor(
    private readonly service: IncomeMessageService,
    private readonly message: BoardMessageService,
  ) {}

  @MessagePattern({ cmd: MsPatternsActions })
  async initPlayers(gameId: string) {
    console.log(2222, gameId);
    return await this.message.initPlayers(gameId, []);
  }

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(gameId: string) {
    await this.service.dicesModal(gameId);
    return await this.message.createBoardMessage(gameId);
  }
}
