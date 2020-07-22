import { Controller, Header, HttpCode, Post, Body } from '@nestjs/common';
import { IBoardAction, IncomeMessageType } from 'src/types/Board/board.types';

@Controller('game')
export class GameController {
  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(@Body() action: IBoardAction): Promise<string> {
    return JSON.stringify(action);
  }

  @Post(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async rollDices(@Body() action: IBoardAction): Promise<string> {
    return JSON.stringify(action);
  }
}
