import { IFieldId, IncomeMessageType } from 'src/types/Board/board.types';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ActionService } from 'src/api.gateway/action/action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardSocket } from './board.socket';
import { ChecksService } from 'src/api.gateway/action/checks.service';
import { ErrorCode } from 'src/utils/error.code';
import { FieldsUtilsService } from 'src/api.gateway/action/fields.utils.service';
import { IActionId } from 'src/types/Board/board.types';
import { PlayersUtilsService } from 'src/api.gateway/action/players.utils.service';
import { Socket } from 'socket.io';
import { StoreService } from 'src/api.gateway/action/store.service';
import { TransactionService } from 'src/api.gateway/action/transaction.service';
import _ from 'lodash';
import { nanoid } from 'nanoid';

@WebSocketGateway()
export class IncomeSocketMessage {
  constructor(
    private readonly service: BoardSocket,
    private readonly playersService: PlayersUtilsService,
    private readonly fieldsService: FieldsUtilsService,
    private readonly actionsService: ActionService,
    private readonly checksService: ChecksService,
    private readonly transactionService: TransactionService,
    private readonly store: StoreService,
  ) {}

  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const gameId = 'kkk';
    try {
      await this.actionsService.rollDicesAction(gameId);
      await this.service.emitMessage();

      await this.tokenMovedAfterClick(gameId);

      setTimeout(() => {
        this.service.emitMessage();
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    } catch (err) {
      console.log('Error in dicesModal', err);
    }
  }

  async tokenMovedAfterClick(gameId: string) {
    try {
      const player = await this.playersService.getActingPlayer(gameId);
      const field = await this.fieldsService.getActingField(gameId);

      if (!player.jailed) {
        if (await this.checksService.isStartPass(gameId)) {
          // Bonus for start passing
          player.meanPosition === 0
            ? await this.transactionService.getStartBonus(
                gameId,
                player.userId,
                true,
              )
            : await this.transactionService.getStartBonus(
                gameId,
                player.userId,
              );

          await this.actionsService.switchPlayerTurn(gameId, false);
        }
        console.log(0, player.meanPosition);
        if (await this.checksService.noActionField(gameId)) {
          console.log(1);
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (await this.checksService.isMyField(gameId, field.fieldId)) {
          console.log(2);
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (
          await this.checksService.isCompanyForSale(gameId, field.fieldId)
        ) {
          console.log(3);
          await this.actionsService.buyFieldModal(gameId);
        } else if (
          !(await this.checksService.isCompanyForSale(gameId, field.fieldId)) &&
          (await this.checksService.isMyField(gameId, field.fieldId))
        ) {
          console.log(4);
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (
          (await this.checksService.whosField(gameId)) &&
          !(await this.checksService.isMyField(gameId, field.fieldId))
        ) {
          console.log(5);
          await this.store.setTransaction(gameId, {
            sum: await this.fieldsService.getFieldRent(gameId, field),
            userId: player.userId,
            toUserId: await this.checksService.whosField(gameId),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal(gameId);
        } else if (await this.checksService.isJail(gameId)) {
          console.log(6);
          (await this.playersService.jailPlayer(gameId)) &&
            (await this.actionsService.switchPlayerTurn(gameId, false));
        } else if (await this.checksService.isTax(gameId)) {
          console.log(7);
          // TODO написать нормальный текст на налоги
          await this.store.setTransaction(gameId, {
            sum: await this.fieldsService.getFieldRent(gameId, field),
            userId: player.userId,
            toUserId: await await this.checksService.whosField(gameId),
            reason: 'Самое время заплатить налоги',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal(gameId);
        } else if (await this.checksService.isChance(gameId)) {
          console.log(8);
          // TODO Make a real chance field await this.actionsService
          await this.store.setTransaction(gameId, {
            sum: 1000,
            userId: player.userId,
            toUserId: await this.checksService.whosField(gameId),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal(gameId);
        }
      } else {
        console.log(9);
        if (player.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else {
          await this.store.setTransaction(gameId, {
            sum: 500,
            userId: player.userId,
            toUserId: await this.checksService.whosField(gameId),
            reason: 'Залог за выход из тюрьмы',
            transactionId: nanoid(4),
          });
          await this.actionsService.payUnJailModal(gameId);
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    const f = await this.fieldsService.getActingField('kkk');
    const p = await this.playersService.getActingPlayer('kkk');
    if (await this.checksService.canBuyField('kkk', f.fieldId, p)) {
      await this.actionsService.buyField('kkk');
      await this.actionsService.switchPlayerTurn('kkk', false);
    } else {
      !(await this.checksService.isCompanyForSale('kkk', f.fieldId)) &&
        (await this.store.setError('kkk', {
          code: ErrorCode.CompanyHasOwner,
          message: 'Oops!',
        }));
      !(await this.checksService.canBuyField('kkk', f.fieldId, p)) &&
        (await this.store.setError('kkk', {
          code: ErrorCode.NotEnoughMoney,
          message: 'Oops!',
        }));
    }

    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    await this.actionsService.startAuctionModal('kkk');
    await this.actionsService.switchPlayerTurn('kkk', false);

    this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    if (
      (await this.transactionService.getCurrentTransaction('kkk')).sum <
      (await this.playersService.getActingPlayer('kkk')).money
    ) {
      await this.transactionService.transactMoney(
        'kkk',
        (await this.transactionService.getCurrentTransaction('kkk'))
          .transactionId,
      );
      await this.actionsService.switchPlayerTurn('kkk', false);
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
    await this.playersService.unjailPlayer('kkk');
    await this.service.emitMessage();
    setTimeout(async () => {
      await this.actionsService.rollDicesModal('kkk');
      await this.service.emitMessage();
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checksService.canMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fieldsService.mortgage('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED)
  async unMortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checksService.canUnMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fieldsService.unMortgage('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED)
  async levelUpField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checksService.canLevelUp('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fieldsService.levelUpField('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED)
  async levelDownField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checksService.canLevelDown('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fieldsService.levelDownField('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }
}
