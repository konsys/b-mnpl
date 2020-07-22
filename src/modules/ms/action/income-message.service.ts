import { IErrorMessage, StoreService } from './store.service';

import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardSocket } from 'src/modules/socket/board.socket';
import { ChecksService } from './checks.service';
import { ErrorCode } from 'src/utils/error.code';
import { FieldsUtilsService } from './fields.utils.service';
import { IFieldId } from 'src/types/board/board.types';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { SocketActions } from 'src/types/game/game.types';
import { TransactionsService } from './transactions.service';
import { nanoid } from 'nanoid';

@Injectable()
export class IncomeMessageService {
  async onModuleInit() {
    await this.store.flushGame('kkk');
  }

  constructor(
    private readonly players: PlayersUtilsService,
    @Inject(forwardRef(() => FieldsUtilsService))
    private readonly fields: FieldsUtilsService,
    @Inject(forwardRef(() => ActionService))
    private readonly actions: ActionService,
    private readonly checks: ChecksService,
    private readonly transactions: TransactionsService,
    private readonly store: StoreService,
  ) {}

  async levelDownField(payload: IFieldId): Promise<void> {
    if (!(await this.checks.canLevelDown('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelDownField('kkk', payload.fieldId);
    }
  }

  async levelUpField(payload: IFieldId): Promise<void> {
    if (!(await this.checks.canLevelUp('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelUpField('kkk', payload.fieldId);
    }
  }

  async unMortgageField(payload: IFieldId): Promise<void> {
    if (!(await this.checks.canUnMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.unMortgage('kkk', payload.fieldId);
      await this.getNextAction('kkk');
    }
  }

  async mortgageField(payload: IFieldId): Promise<void> {
    if (!(await this.checks.canMortgage('kkk', payload.fieldId))) {
      await this.store.setError('kkk', {
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.mortgage('kkk', payload.fieldId);
      await this.getNextAction('kkk');
    }
  }

  async unJailPayment(): Promise<void> {
    await this.players.unjailPlayer('kkk');

    setTimeout(async () => {
      await this.actions.rollDicesModal('kkk');
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  async payment(): Promise<void> {
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
  }

  async declineAuction(): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.declineAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async acceptAuction(): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.acceptAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldAuction(): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.startAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldBought(): Promise<void> {
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
  }

  async dicesModal(gameId: string): Promise<void> {
    try {
      await this.actions.rollDicesAction(gameId);

      await this.getNextAction(gameId);
      setTimeout(async () => {}, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    } catch (err) {
      console.log('Error in dicesModal', err);
    }
  }

  async getNextAction(gameId: string) {
    try {
      const player = await this.players.getActingPlayer(gameId);
      const field = await this.fields.getFieldByPosition(
        gameId,
        player.meanPosition,
      );

      if (!player.jailed) {
        if (await this.checks.isStartPass(gameId)) {
          // Bonus for start passing
          player.meanPosition === 0
            ? await this.transactions.getStartBonus(gameId, player.userId, true)
            : await this.transactions.getStartBonus(gameId, player.userId);
        }

        if (await this.checks.noActionField(gameId, field.fieldId)) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (await this.checks.isMyField(gameId, field.fieldId)) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (await this.checks.isCompanyForSale(gameId, field.fieldId)) {
          await this.actions.buyFieldModal(gameId);
        } else if (
          !(await this.checks.isCompanyForSale(gameId, field.fieldId)) &&
          (await this.checks.isMyField(gameId, field.fieldId))
        ) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (
          (await this.checks.isCompany(gameId, field.fieldId)) &&
          (await this.checks.whosField(gameId, field.fieldId)) &&
          !(await this.checks.isMyField(gameId, field.fieldId))
        ) {
          await this.store.setTransaction(gameId, {
            sum: await this.fields.getFieldRent(gameId, field),
            userId: player.userId,
            toUserId: await this.checks.whosField(gameId, field.fieldId),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, player.userId);
        } else if (await this.checks.isJail(gameId, field.fieldId)) {
          (await this.players.jailPlayer(gameId)) &&
            (await this.actions.switchPlayerTurn(gameId, false));
        } else if (await this.checks.isTax(gameId, field.fieldId)) {
          // TODO написать нормальный текст на налоги
          await this.store.setTransaction(gameId, {
            sum: await this.fields.getFieldRent(gameId, field),
            userId: player.userId,
            toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
            reason: 'Самое время заплатить налоги' + player.name,
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, player.userId);
        } else if (await this.checks.isChance(gameId, field.fieldId)) {
          // TODO Make a real chance field await this.actions
          await this.store.setTransaction(gameId, {
            sum: 1000,
            userId: player.userId,
            toUserId: await this.checks.whosField(gameId, field.fieldId),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, player.userId);
        }
      } else {
        if (player.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else {
          await this.store.setTransaction(gameId, {
            sum: 500,
            userId: player.userId,
            toUserId: await this.checks.whosField(gameId, field.fieldId),
            reason: 'Залог за выход из тюрьмы',
            transactionId: nanoid(4),
          });
          await this.actions.payUnJailModal(gameId);
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  public async emitError(error: IErrorMessage) {
    BoardSocket.socketServer.emit(SocketActions.ERROR_MESSAGE, error);
    await this.store.resetError('kkk');
  }
}
