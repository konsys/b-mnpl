import { Controller, Header, HttpCode, Post, Body } from '@nestjs/common';
import { IncomeMessageType } from 'src/types/board/board.types';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly income: GameService) {}

  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(
    @Body() action: IncomeMessageType,
    payload: any,
  ): Promise<string> {
    switch (action) {
      case IncomeMessageType.INCOME_ROLL_DICES_CLICKED:
        await this.income.dicesModal();

      case IncomeMessageType.INCOME_BUY_FIELD_CLICKED:
        await this.income.fieldBought();

      case IncomeMessageType.INCOME_AUCTION_START_CLICKED:
        await this.income.fieldAuction();

      case IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED:
        await this.income.acceptAuction();

      case IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED:
        await this.income.declineAuction();

      case IncomeMessageType.INCOME_TAX_PAID_CLICKED:
        await this.income.payment();

      case IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED:
        await this.income.unJailPayment();

      case IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED:
        await this.income.mortgageField(payload);

      case IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED:
        await this.income.unMortgageField(payload);

      case IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED:
        await this.income.levelUpField(payload);

      case IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED:
        await this.income.levelDownField(payload);
    }

    return JSON.stringify({ code: 0 });
  }
}
