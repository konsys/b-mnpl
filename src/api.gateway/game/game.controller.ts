import {
  Controller,
  Header,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IncomeMessageType } from 'src/types/board/board.types';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('game')
export class GameController {
  constructor(private readonly service: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(
    @Request() req,
    @Body('action') action: IncomeMessageType,
    @Body('fieldId') fieldId: number,
  ): Promise<string> {
    const userId = req.user.userId;
    switch (action) {
      case IncomeMessageType.INCOME_ROLL_DICES_CLICKED:
        await this.service.dicesModalClicked({ userId });
        break;

      case IncomeMessageType.INCOME_BUY_FIELD_CLICKED:
        await this.service.fieldBought({ userId });
        break;

      case IncomeMessageType.INCOME_AUCTION_START_CLICKED:
        await this.service.fieldAuction({ userId });
        break;

      case IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED:
        await this.service.acceptAuction({ userId });
        break;

      case IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED:
        await this.service.declineAuction({ userId });
        break;

      case IncomeMessageType.INCOME_TAX_PAID_CLICKED:
        await this.service.payment({ userId });
        break;
      case IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED:
        await this.service.unJailPayment({ userId });
        break;

      case IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED:
        await this.service.mortgageField({ userId, fieldId });
        break;

      case IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED:
        await this.service.unMortgageField({ userId, fieldId });
        break;

      case IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED:
        await this.service.levelUpField({ userId, fieldId });
        break;

      case IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED:
        await this.service.levelDownField({ userId, fieldId });
        break;
    }

    return JSON.stringify({ code: 0 });
  }
}
