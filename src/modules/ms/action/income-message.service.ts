import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { ChecksService } from './checks.service';
import { ErrorCode } from 'src/utils/error.code';
import { FieldsUtilsService } from './fields.utils.service';
import { IFieldId } from 'src/types/board/board.types';
import { Injectable } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import { nanoid } from 'nanoid';

@Injectable()
export class IncomeMessageService {
  async onModuleInit() {
    await this.store.flushGame('kkk');
  }

  constructor(
    private readonly players: PlayersUtilsService,
    private readonly fields: FieldsUtilsService,
    private readonly actions: ActionService,
    private readonly checks: ChecksService,
    private readonly transactions: TransactionsService,
    private readonly store: StoreService,
  ) {}

  async levelDownField(userId: number, payload: IFieldId): Promise<void> {
    const p = await this.players.getPlayer(userId);
    if (!(await this.checks.canLevelDown(userId, payload.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelDownField(p.gameId, payload.fieldId);
    }
  }

  async levelUpField(userId: number, payload: IFieldId): Promise<void> {
    const p = await this.players.getPlayer(userId);
    if (!(await this.checks.canLevelUp(userId, payload.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelUpField(p.gameId, payload.fieldId);
    }
  }

  async unMortgageField(userId: number, payload: IFieldId): Promise<void> {
    const p = await this.players.getPlayer(userId);
    if (!(await this.checks.canUnMortgage(userId, payload.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.unMortgage(userId, payload.fieldId);
      await this.getNextAction(p.gameId);
    }
  }

  async mortgageField(userId: number, payload: IFieldId): Promise<void> {
    const p = await this.players.getPlayer(userId);
    if (!(await this.checks.canMortgage(userId, payload.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.mortgage(userId, payload.fieldId);
      await this.getNextAction(p.gameId);
    }
  }

  async unJailPayment(userId: number): Promise<void> {
    await this.players.unjailPlayer('kkk');

    setTimeout(async () => {
      await this.actions.rollDicesModal('kkk');
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  async payment(userId: number): Promise<void> {
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

  async declineAuction(userId: number): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.declineAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async acceptAuction(userId: number): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.acceptAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldAuction(userId: number): Promise<void> {
    const f = await this.fields.getActingField('kkk');
    const canStart = await this.checks.isCompanyForSale('kkk', f.fieldId);
    canStart
      ? await this.actions.startAuctionModal('kkk')
      : await this.store.setError('kkk', {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldBought(gameId: string, fieldId: number): Promise<void> {
    const f = await this.fields.getField(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);
    if (
      (await this.checks.isCompanyForSale(p.userId, fieldId)) &&
      (await this.checks.canBuyField(fieldId, p))
    ) {
      await this.actions.buyField(f.fieldId, p.userId, f.price.startPrice);
      await this.actions.switchPlayerTurn(p.userId, false);
    } else if (!(await this.checks.isCompanyForSale(p.userId, f.fieldId))) {
      await this.store.setError(p.userId, {
        code: ErrorCode.CompanyHasOwner,
        message: 'Oops!',
      });
    } else if (!(await this.checks.canBuyField(f.fieldId, p))) {
      await this.store.setError(p.userId, {
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
    }
  }

  async dicesModal(userId: number): Promise<void> {
    try {
      await this.actions.rollDicesAction(userId);
      await this.store.emitMessage(gameId);
      await this.getNextAction(gameId);
      setTimeout(async () => {}, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    } catch (err) {
      console.log('Error in dicesModal', err);
    }
  }

  async getNextAction(gameId: string) {
    try {
      const p = await this.players.getActingPlayer(gameId);
      const f = await this.fields.getFieldByPosition(gameId, p.meanPosition);

      if (!p.jailed) {
        if (await this.checks.isStartPass(p.gameId)) {
          // Bonus for start passing
          p.meanPosition === 0
            ? await this.transactions.getStartBonus(
                p.gameId,
                player.userId,
                true,
              )
            : await this.transactions.getStartBonus(p.gameId, player.userId);
        }

        if (await this.checks.noActionField(p.gameId, field.fieldId)) {
          await this.actions.switchPlayerTurn(p.gameId, false);
        } else if (await this.checks.isMyField(p.gameId, field.fieldId)) {
          await this.actions.switchPlayerTurn(p.gameId, false);
        } else if (
          await this.checks.isCompanyForSale(p.gameId, field.fieldId)
        ) {
          await this.actions.buyFieldModal(p.gameId);
        } else if (
          !(await this.checks.isCompanyForSale(p.gameId, field.fieldId)) &&
          (await this.checks.isMyField(p.gameId, field.fieldId))
        ) {
          await this.actions.switchPlayerTurn(p.gameId, false);
        } else if (
          (await this.checks.isCompany(p.gameId, field.fieldId)) &&
          (await this.checks.whosField(p.gameId, field.fieldId)) &&
          !(await this.checks.isMyField(p.gameId, field.fieldId))
        ) {
          await this.store.setTransaction(p.gameId, {
            sum: await this.fields.getFieldRent(p.gameId, field),
            userId: player.userId,
            toUserId: await this.checks.whosField(p.gameId, field.fieldId),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(p.gameId, player.userId);
        } else if (await this.checks.isJail(p.gameId, field.fieldId)) {
          (await this.players.jailPlayer(p.gameId)) &&
            (await this.actions.switchPlayerTurn(p.gameId, false));
        } else if (await this.checks.isTax(p.gameId, field.fieldId)) {
          // TODO написать нормальный текст на налоги
          await this.store.setTransaction(p.gameId, {
            sum: await this.fields.getFieldRent(p.gameId, field),
            userId: player.userId,
            toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
            reason: 'Самое время заплатить налоги' + p.name,
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(p.gameId, p.userId);
        } else if (await this.checks.isChance(p.gameId, field.fieldId)) {
          // TODO Make a real chance field await this.actions
          await this.store.setTransaction(p.gameId, {
            sum: 1000,
            userId: p.userId,
            toUserId: await this.checks.whosField(p.gameId, field.fieldId),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(p.gameId, p.userId);
        }
      } else {
        if (p.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
          await this.actions.switchPlayerTurn(p.gameId, false);
        } else {
          await this.store.setTransaction(p.gameId, {
            sum: 500,
            userId: p.userId,
            toUserId: await this.checks.whosField(p.gameId, field.fieldId),
            reason: 'Залог за выход из тюрьмы',
            transactionId: nanoid(4),
          });
          await this.actions.payUnJailModal(p.gameId);
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }
}
