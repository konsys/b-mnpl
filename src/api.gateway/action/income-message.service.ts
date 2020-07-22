import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardSocket } from 'src/modules/socket/board.socket';
import { ChecksService } from './checks.service';
import { FieldsUtilsService } from './fields.utils.service';
import { Injectable } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import { nanoid } from 'nanoid';

@Injectable()
export class IncomeMessageService {
  constructor(
    private readonly service: BoardSocket,
    private readonly players: PlayersUtilsService,
    private readonly fields: FieldsUtilsService,
    private readonly actions: ActionService,
    private readonly checks: ChecksService,
    private readonly transactions: TransactionsService,
    private readonly store: StoreService,
  ) {}

  async dicesModal(): Promise<void> {
    const gameId = 'kkk';
    try {
      await this.actions.rollDicesAction(gameId);
      await this.service.emitMessage();

      await this.getNextAction(gameId);
      setTimeout(async () => {
        await this.service.emitMessage();
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
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
}
