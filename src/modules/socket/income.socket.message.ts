import { IFieldId, IncomeMessageType } from 'src/types/Board/board.types';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ActionService } from 'src/api.gateway/action/action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardSocket } from './board.socket';
import { ChecksService } from 'src/api.gateway/action/checks.service';
import { ErrorCode } from 'src/utils/error.code';
import { FieldsUtilsService } from 'src/api.gateway/action/fields.utils.service';
import { IActionId } from 'src/types/Board/board.types';
import { IncomeMessageService } from 'src/api.gateway/action/income-message.service';
import { PlayersUtilsService } from 'src/api.gateway/action/players.utils.service';
import { Socket } from 'socket.io';
import { StoreService } from 'src/api.gateway/action/store.service';
import { TransactionsService } from 'src/api.gateway/action/transactions.service';
import _ from 'lodash';
import { nanoid } from 'nanoid';

@WebSocketGateway()
export class IncomeSocketMessage {
  constructor(
    private readonly service: BoardSocket,
    private readonly players: PlayersUtilsService,
    private readonly fields: FieldsUtilsService,
    private readonly actions: ActionService,
    private readonly checks: ChecksService,
    private readonly transactions: TransactionsService,
    private readonly store: StoreService,
    private readonly income: IncomeMessageService,
  ) {}

  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    return await this.income.dicesModal();
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
