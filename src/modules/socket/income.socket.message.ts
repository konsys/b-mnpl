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
    const gameId = 'kkk';
    try {
      await this.actions.rollDicesAction(gameId);
      await this.service.emitMessage();

      await this.income.getNextAction(gameId);
      setTimeout(async () => {
        await this.service.emitMessage();
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    } catch (err) {
      console.log('Error in dicesModal', err);
    }
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    const gameId = 'kkk';
    const f = await this.fields.getActingField(gameId);
    const p = await this.players.getActingPlayer(gameId);
    if (
      (await this.checks.isCompanyForSale(gameId, f.fieldId)) &&
      (await this.checks.canBuyField(gameId, f.fieldId, p))
    ) {
      await this.actions.buyField(
        gameId,
        f.fieldId,
        p.userId,
        f.price.startPrice,
      );
      await this.actions.switchPlayerTurn(gameId, false);
    } else if (!(await this.checks.isCompanyForSale(gameId, f.fieldId))) {
      await this.store.setError(gameId, {
        code: ErrorCode.CompanyHasOwner,
        message: 'Oops!',
      });
    } else if (!(await this.checks.canBuyField(gameId, f.fieldId, p))) {
      await this.store.setError(gameId, {
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.startAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });

    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED)
  async acceptAuction(client: Socket, payload: IActionId): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.acceptAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });

    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED)
  async declineAuction(client: Socket, payload: IActionId): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.declineAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });

    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    if (
      (await this.transactions.getCurrentTransaction('kkk')).sum <=
      (await this.players.getActingPlayer('kkk')).money
    ) {
      await this.transactions.transactMoney(
        'kkk',
        (await this.transactions.getCurrentTransaction('kkk')).transactionId,
      );
      await this.actions.switchPlayerTurn('kkk', false);
    } else {
      await this.store.setError('kkk', {
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED)
  async unJailPayment(client: Socket, payload: IActionId): Promise<void> {
    await this.players.unjailPlayer('kkk');
    await this.service.emitMessage();
    setTimeout(async () => {
      await this.actions.rollDicesModal('kkk');
      await this.service.emitMessage();
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checks.canMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.mortgage('kkk', payload.fieldId);
      await this.income.getNextAction('kkk');
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED)
  async unMortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checks.canUnMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.unMortgage('kkk', payload.fieldId);
      await this.income.getNextAction('kkk');
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED)
  async levelUpField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checks.canLevelUp('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelUpField('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED)
  async levelDownField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checks.canLevelDown('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelDownField('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }
}
