import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomeMessageType, IFieldId } from 'src/types/Board/board.types';
import { Socket } from 'socket.io';
import { IActionId } from 'src/types/Board/board.types';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import { BoardSocket } from 'src/params/board.init';
import { nanoid } from 'nanoid';
import { BOARD_PARAMS } from 'src/params/board.params';
import { getStartBonus } from 'src/utils/moneys.utils';
import { UsersService } from 'src/api.gateway/users/users.service';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { ActionService } from 'src/api.gateway/await this.actionsService/await this.actionsService.service';
import { ChecksService } from 'src/checks/checks.service';

@WebSocketGateway()
export class BoardMessage {
  constructor(
    private readonly service: BoardSocket,
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
    private readonly actionsService: ActionService,
    private readonly checksService: ChecksService,
  ) {}

  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const action = await this.actionsService.getActionStore('kkk');

    if (payload.actionId === (await this.actionsService.actionId)) {
      await this.actionsService.rollDicesAction();
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
        if (await this.checksService.isStartPass()) {
          // Bonus for start passing
          player.meanPosition === 0
            ? getStartBonus(player.userId, true)
            : getStartBonus(player.userId);

          await this.actionsService.switchPlayerTurn();
        }

        if (noActionField()) {
          await this.actionsService.switchPlayerTurn();
        } else if (isMyField(field.fieldId)) {
          await this.actionsService.switchPlayerTurn();
        } else if (isCompanyForSale(field.fieldId)) {
          await this.actionsService.buyFieldModal();
        } else if (
          !isCompanyForSale(field.fieldId) &&
          isMyField(field.fieldId)
        ) {
          await this.actionsService.switchPlayerTurn();
        } else if (whosField() && !isMyField(field.fieldId)) {
          await setTransaction('kkk', {
            sum: await getFieldRent(field),
            userId: player.userId,
            toUserId: await whosField(),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal();
        } else if (isJail()) {
          (await this.usersService.jailPlayer(gameId)) &&
            (await this.actionsService.switchPlayerTurn());
        } else if (isTax()) {
          // TODO написать нормальный текст на налоги
          setTransaction(gameId, {
            sum: await getFieldRent(field),
            userId: player.userId,
            toUserId: await whosField(),
            reason: 'Самое время заплатить налоги',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal();
        } else if (isChance()) {
          // TODO Make a real chance field await this.actionsService
          await setTransaction(gameId, {
            sum: 1000,
            userId: player.userId,
            toUserId: await whosField(),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          await this.actionsService.payTaxModal();
        }
      } else {
        if (player.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
          await this.actionsService.switchPlayerTurn();
        } else {
          await setTransaction(gameId, {
            sum: 500,
            userId: player.userId,
            toUserId: await whosField(),
            reason: 'Залог за выход из тюрьмы',
            transactionId: nanoid(4),
          });
          await this.actionsService.payUnJailModal();
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    const f = await getActingField('kkk');
    const p = await this.usersService.getActingPlayer('kkk');
    if (canBuyField(f.fieldId, p)) {
      await this.actionsService.buyField();
      await this.actionsService.switchPlayerTurn();
    } else {
      !isCompanyForSale(f.fieldId) &&
        setError({
          code: ErrorCode.CompanyHasOwner,
          message: 'Oops!',
        });
      !canBuyField(f.fieldId, p) &&
        setError({
          code: ErrorCode.NotEnoughMoney,
          message: 'Oops!',
        });
    }

    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    await this.actionsService.startAuctionModal();
    await this.actionsService.switchPlayerTurn();

    this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    if (
      (await getCurrentTransaction('kkk')).sum <
      (await this.usersService.getActingPlayer('kkk')).money
    ) {
      await transactMoney(
        'kkk',
        (await getCurrentTransaction('kkk')).transactionId,
      );
      await this.actionsService.switchPlayerTurn();
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
      await this.actionsService.rollDicesModal();
      await this.service.emitMessage();
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!canMortgage(payload.fieldId)) {
      setError({
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      mortgage(payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED)
  async unMortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!canUnMortgage(payload.fieldId)) {
      setError({
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      unMortgage(payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED)
  async levelUpField(client: Socket, payload: IFieldId): Promise<void> {
    if (!canLevelUp(payload.fieldId)) {
      setError({
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      levelUpField(payload.fieldId);
    }
    await this.service.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED)
  async levelDownField(client: Socket, payload: IFieldId): Promise<void> {
    if (!canLevelDown(payload.fieldId)) {
      setError({
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      levelDownField(payload.fieldId);
    }
    await this.service.emitMessage();
  }
}
