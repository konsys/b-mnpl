import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { ChecksService } from './checks.service';
import { ErrorCode } from 'src/utils/error.code';
import { FieldsUtilsService } from './fields.utils.service';
import { IContract } from 'src/types/board/board.types';
import { Injectable } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import { nanoid } from 'nanoid';

@Injectable()
export class IncomeMessageService {
  // 5089
  constructor(
    private readonly players: PlayersUtilsService,
    private readonly fields: FieldsUtilsService,
    private readonly actions: ActionService,
    private readonly checks: ChecksService,
    private readonly transactions: TransactionsService,
    private readonly store: StoreService,
  ) {}

  async levelDownField(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);

    const f = await this.fields.getFieldByPosition(p.gameId, p.meanPosition);
    if (!(await this.checks.canLevelDown(p.gameId, f.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelDownField(p.gameId, f.fieldId);
    }
  }

  async levelUpField(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getFieldByPosition(p.gameId, p.meanPosition);
    if (!(await this.checks.canLevelUp(p.gameId, f.fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotBuildBranch,
        message: 'Oops!',
      });
    } else {
      await this.fields.levelUpField(p.gameId, f.fieldId);
    }
  }

  async unMortgageField(
    gameId: string,
    userId: number,
    fieldId: number,
  ): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    if (!(await this.checks.canUnMortgage(p.gameId, fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotUnMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.unMortgage(p.gameId, fieldId);
      await this.getNextAction(gameId, p.userId);
    }
  }

  async mortgageField(
    gameId: string,
    userId: number,
    fieldId: number,
  ): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);

    if (!(await this.checks.canMortgage(p.gameId, fieldId))) {
      await this.store.setError(userId, {
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
    } else {
      await this.fields.mortgage(p.gameId, fieldId);
      await this.getNextAction(gameId, p.userId);
    }
  }

  async unJailPayment(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    await this.players.unjailPlayer(p.gameId);
    setTimeout(async () => {
      await this.actions.rollDicesModal(gameId);
      // await this.store.emitMessage(gameId);
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  async payment(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    if (
      (await this.transactions.getCurrentTransaction(p.gameId)).sum <=
      (await this.players.getActingPlayer(p.gameId)).money
    ) {
      await this.transactions.transactMoney(
        p.gameId,
        (await this.transactions.getCurrentTransaction(p.gameId)).transactionId,
      );
      await this.actions.switchPlayerTurn(gameId, false);
    } else {
      await this.store.setError(userId, {
        code: ErrorCode.NotEnoughMoney,
        message: 'Oops!',
      });
    }
  }

  async declineAuction(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getActingField(p.gameId);
    const canStart = await this.checks.isCompanyForSale(p.gameId, f.fieldId);
    canStart
      ? await this.actions.declineAuctionModal(gameId, p.userId)
      : await this.store.setError(p.userId, {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async acceptAuction(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getActingField(p.gameId);
    const canStart = await this.checks.isCompanyForSale(p.gameId, f.fieldId);
    canStart
      ? await this.actions.acceptAuctionModal(gameId, p.userId)
      : await this.store.setError(p.userId, {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldAuction(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getActingField(p.gameId);
    const canStart = await this.checks.isCompanyForSale(p.gameId, f.fieldId);
    canStart
      ? await this.actions.startAuctionModal(gameId)
      : await this.store.setError(p.userId, {
          code: ErrorCode.CannotStartAuction,
          message: 'Oops!',
        });
  }

  async fieldBought(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getFieldByPosition(p.gameId, p.meanPosition);

    if (
      (await this.checks.isCompanyForSale(p.gameId, f.fieldId)) &&
      (await this.checks.canBuyField(f.fieldId, p))
    ) {
      await this.actions.buyField(
        gameId,
        f.fieldId,
        p.userId,
        f.price.startPrice,
      );

      await this.actions.switchPlayerTurn(gameId, false);
    } else if (!(await this.checks.isCompanyForSale(p.gameId, f.fieldId))) {
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

  async dicesModal(gameId: string, userId: number): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);

    try {
      await this.actions.rollDicesAction(gameId, userId);
      await this.store.emitMessage(gameId);
      await this.getNextAction(gameId, userId);
      setTimeout(async () => {
        await this.store.emitMessage(p.gameId);
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
    } catch (err) {
      console.log('Error in dicesModal', err);
    }
  }

  async contractStart(
    gameId: string,
    userId: number,
    contract: IContract,
  ): Promise<void> {
    const p = await this.players.getPlayer(gameId, userId);

    if (!(await this.checks.isContractValid(contract))) {
      await this.store.setError(p.userId, {
        code: ErrorCode.CompanyHasOwner,
        message: 'Oops!',
      });
      return;
    }

    await this.store.setContractStore(gameId, contract);
    await this.actions.contractModal(gameId, contract);
    await this.store.emitMessage(gameId);
  }

  private async getNextAction(gameId: string, userId: number) {
    try {
      const p = await this.players.getPlayer(gameId, userId);
      const f = await this.fields.getFieldByPosition(p.gameId, p.meanPosition);

      if (!p.jailed) {
        if (await this.checks.isStartPass(p.userId)) {
          // Bonus for start passing
          p.meanPosition === 0
            ? await this.transactions.getStartBonus(p.userId, true)
            : await this.transactions.getStartBonus(p.userId);
        }
        if (await this.checks.isStart(p.gameId, f.fieldId)) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (await this.checks.noActionField(p.gameId, f.fieldId)) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (await this.checks.isMyField(p.userId, f.fieldId)) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (await this.checks.isCompanyForSale(p.gameId, f.fieldId)) {
          await this.actions.buyFieldModal(gameId);
        } else if (
          !(await this.checks.isCompanyForSale(p.gameId, f.fieldId)) &&
          (await this.checks.isMyField(p.userId, f.fieldId))
        ) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else if (
          (await this.checks.isCompany(p.gameId, f.fieldId)) &&
          (await this.checks.whosField(p.gameId, f.fieldId)) &&
          !(await this.checks.isMyField(p.userId, f.fieldId))
        ) {
          await this.store.setTransaction(p.gameId, {
            sum: await this.fields.getFieldRent(p.gameId, f),
            userId: p.userId,
            toUserId: await this.checks.whosField(p.gameId, f.fieldId),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, p.userId);
        } else if (await this.checks.isJail(p.gameId, f.fieldId)) {
          (await this.players.jailPlayer(p.gameId)) &&
            (await this.actions.switchPlayerTurn(gameId, false));
        } else if (await this.checks.isTax(p.gameId, f.fieldId)) {
          // TODO написать нормальный текст на налоги
          await this.store.setTransaction(p.gameId, {
            sum: await this.fields.getFieldRent(p.gameId, f),
            userId: p.userId,
            toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
            reason: 'Самое время заплатить налоги' + p.name,
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, p.userId);
        } else if (await this.checks.isChance(p.gameId, f.fieldId)) {
          // TODO Make a real chance field await this.actions
          await this.store.setTransaction(p.gameId, {
            sum: 1000,
            userId: p.userId,
            toUserId: await this.checks.whosField(p.gameId, f.fieldId),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          await this.actions.payTaxModal(gameId, p.userId);
        }
      } else {
        if (p.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
          await this.actions.switchPlayerTurn(gameId, false);
        } else {
          await this.store.setTransaction(p.gameId, {
            sum: 500,
            userId: p.userId,
            toUserId: await this.checks.whosField(p.gameId, f.fieldId),
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
}
