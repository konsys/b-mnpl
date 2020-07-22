import { IFieldId, IncomeMessageType } from 'src/types/board/board.types';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { IActionId } from 'src/types/board/board.types';
import { IncomeMessageService } from 'src/modules/ms/action/income-message.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class IncomeSocketMessage {
  constructor(private readonly income: IncomeMessageService) {}

  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.dicesModal(payload.gameId);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.fieldBought();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.fieldAuction();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED)
  async acceptAuction(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.acceptAuction();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED)
  async declineAuction(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.declineAuction();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.payment();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED)
  async unJailPayment(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.unJailPayment();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    return await this.income.mortgageField(payload);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED)
  async unMortgageField(client: Socket, payload: IFieldId): Promise<void> {
    return await this.income.unMortgageField(payload);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED)
  async levelUpField(client: Socket, payload: IFieldId): Promise<void> {
    return await this.income.levelUpField(payload);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED)
  async levelDownField(client: Socket, payload: IFieldId): Promise<void> {
    return await this.income.levelDownField(payload);
  }
}
