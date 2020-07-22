import { Controller } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';
import { IncomeMessageType } from 'src/types/board/board.types';
import { MessagePattern } from '@nestjs/microservices';

@Controller('action')
export class ActionController {
  constructor(private readonly service: IncomeMessageService) {}

  @MessagePattern({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED })
  async rollDices(filter: any) {
    await this.service.dicesModal('kkk');
  }
}
