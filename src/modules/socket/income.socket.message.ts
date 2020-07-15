import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomeMessageType, IFieldId } from 'src/types/Board/board.types';
import { Socket } from 'socket.io';
import { IActionId } from 'src/types/Board/board.types';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import { BoardSocket } from 'src/params/board.init';
import { nanoid } from 'nanoid';
import { BOARD_PARAMS } from 'src/params/board.params';
import { UsersService } from 'src/api.gateway/users/users.service';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { ChecksService } from 'src/api.gateway/checks/checks.service';
import { TransactionService } from 'src/api.gateway/transaction/transaction.service';
import { ActionService } from 'src/api.gateway/action/action.service';
import { StoreService } from 'src/api.gateway/store/store.service';

@WebSocketGateway()
export class IncomeSocketMessage {
  constructor(
    private readonly service: BoardSocket,
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
    private readonly actionsService: ActionService,
    private readonly checksService: ChecksService,
    private readonly transactionService: TransactionService,
    private readonly store: StoreService,
  ) {}

  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const action = await this.store.getActionStore('kkk');

    if (payload.actionId === action.actionId) {
      await this.actionsService.rollDicesAction('kkk');
      this.service.emitMessage();
      this.tokenMovedAfterClick('kkk');
      setTimeout(() => {
        this.service.emitMessage();
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    }
  }

  async tokenMovedAfterClick(gameId: string) {
    try {
      const player = await this.usersService.getActingPlayer(gameId);
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

        if (await this.checksService.noActionField(gameId)) {
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (await this.checksService.isMyField(gameId, field.fieldId)) {
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (
          await this.checksService.isCompanyForSale(gameId, field.fieldId)
        ) {
          await this.actionsService.buyFieldModal(gameId);
        } else if (
          !(await this.checksService.isCompanyForSale(gameId, field.fieldId)) &&
          (await this.checksService.isMyField(gameId, field.fieldId))
        ) {
          await this.actionsService.switchPlayerTurn(gameId, false);
        } else if (
          (await this.checksService.whosField(gameId)) &&
          !(await this.checksService.isMyField(gameId, field.fieldId))
        ) {
          await this.store.setTransaction(gameId, {
            sum: await this.fieldsService.getFieldRent(gameId, field),
            userId: player.userId,
            toUserId: await this.checksService.whosField(gameId),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal(gameId);
        } else if (await this.checksService.isJail(gameId)) {
          (await this.usersService.jailPlayer(gameId)) &&
            (await this.actionsService.switchPlayerTurn(gameId, false));
        } else if (await this.checksService.isTax(gameId)) {
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
    const p = await this.usersService.getActingPlayer('kkk');
    if (await this.checksService.canBuyField('kkk', f.fieldId, p)) {
      await this.actionsService.buyField('kkk');
      await this.actionsService.switchPlayerTurn('kkk', false);
    } else {
      !(await this.checksService.isCompanyForSale('kkk', f.fieldId)) &&
        setError({
          code: ErrorCode.CompanyHasOwner,
          message: 'Oops!',
        });
      !(await this.checksService.canBuyField('kkk', f.fieldId, p)) &&
        setError({
          code: ErrorCode.NotEnoughMoney,
          message: 'Oops!',
        });
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
      (await this.usersService.getActingPlayer('kkk')).money
    ) {
      await this.transactionService.transactMoney(
        'kkk',
        (await this.transactionService.getCurrentTransaction('kkk'))
          .transactionId,
      );
      await this.actionsService.switchPlayerTurn('kkk', false);
    } else {
      setError({
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED)
  async unJailPayment(client: Socket, payload: IActionId): Promise<void> {
    await this.usersService.unjailPlayer('kkk');
    await this.service.emitMessage();
    setTimeout(async () => {
      await this.actionsService.rollDicesModal('kkk');
      await this.service.emitMessage();
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!(await this.checksService.canMortgage('kkk', payload.fieldId))) {
      setError({
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
      setError({
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
      setError({
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
      setError({
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fieldsService.levelDownField('kkk', payload.fieldId);
    }
    await this.service.emitMessage();
  }
}
