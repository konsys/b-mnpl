import { Controller, Header, HttpCode, Post, Body } from '@nestjs/common';
import {
  IncomeMessageType,
  IActionId,
  IFieldId,
} from 'src/types/board/board.types';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(
    @Body('action') action: IncomeMessageType,
    @Body('payload') payload?: IFieldId,
  ): Promise<string> {
    console.log(11111, action, payload);
    const incomeAction: IActionId = {
      gameId: 'kkk',
      actionId: 'actionId',
      userId: 2,
    };

    switch (action) {
      case IncomeMessageType.INCOME_ROLL_DICES_CLICKED:
        await this.service.dicesModal(incomeAction);

      case IncomeMessageType.INCOME_BUY_FIELD_CLICKED:
        await this.service.fieldBought();

      case IncomeMessageType.INCOME_AUCTION_START_CLICKED:
        await this.service.fieldAuction();

      case IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED:
        await this.service.acceptAuction();

      case IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED:
        await this.service.declineAuction();

      case IncomeMessageType.INCOME_TAX_PAID_CLICKED:
        await this.service.payment();

      case IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED:
        await this.service.unJailPayment();

      case IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED:
        await this.service.mortgageField(payload);

      case IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED:
        await this.service.unMortgageField(payload);

      case IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED:
        await this.service.levelUpField(payload);

      case IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED:
        await this.service.levelDownField(payload);
    }

    return JSON.stringify({ code: 0 });
  }
}
