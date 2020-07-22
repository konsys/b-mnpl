import { BoardMessageService } from './board.message.service';
import { Controller } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';
import { IncomeMessageType } from 'src/types/board/board.types';
import { MessagePattern } from '@nestjs/microservices';

@Controller('action')
export class ActionMsController {
  constructor(
    private readonly service: IncomeMessageService,
    private readonly message: BoardMessageService,
  ) {}

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(gameId: string) {
    await this.service.dicesModal(gameId);
    await this.message.createBoardMessage(gameId);
  }
}
