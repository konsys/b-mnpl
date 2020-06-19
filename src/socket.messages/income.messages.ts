import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomeMessageType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { IActionId } from 'src/types/board.types';
import {
  isCompanyForSale,
  canBuyField,
  isTax,
  isStartPass,
  noActionField,
  isJail,
  isChance,
  isMyField,
  whosField,
  getActingField,
} from 'src/utils/fields.utils';
import * as Action from 'src/utils/actions.utils';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import {
  getActingPlayer,
  unjailPlayer,
  jailPlayer,
} from 'src/utils/users.utils';
// import { START_BONUS } from 'src/utils/board.params.utils';
import { BoardSocket } from 'src/modules/socket/board.init';
import { LINE_TRANSITION_TIMEOUT } from 'src/types/board.params';
import {
  setTransactionEvent,
  transactMoneyEvent,
  getCurrentTransaction,
} from 'src/stores/transactions.store';
import { nanoid } from 'nanoid';
import { getCurrentAction } from 'src/stores/actions.store';
import { dicesStore } from 'src/stores/dices.store';
import { JAIL_TURNS } from 'src/utils/board.params';
import { getStartBonus } from 'src/utils/moneys.utils';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    const action = getCurrentAction();

    if (payload.actionId === action.actionId) {
      Action.rollDicesAction();
      BoardSocket.emitMessage();
      this.tokenMovedAfterClick();
      setTimeout(() => {
        BoardSocket.emitMessage();
      }, LINE_TRANSITION_TIMEOUT * 3);
    }
  }

  tokenMovedAfterClick() {
    try {
      const player = getActingPlayer();
      const field = getActingField();
      const dices = dicesStore.getState();

      if (!player.jailed) {
        if (isStartPass()) {
          // Bonus for start passing
          player.meanPosition === 0
            ? getStartBonus(player.userId, true)
            : getStartBonus(player.userId);

          Action.switchPlayerTurn();
        }

        if (noActionField()) {
          Action.switchPlayerTurn();
        } else if (isMyField()) {
          Action.switchPlayerTurn();
        } else if (isCompanyForSale()) {
          Action.buyFieldModal();
        } else if (!isCompanyForSale() && isMyField()) {
          Action.switchPlayerTurn();
        } else if (whosField() && !isMyField()) {
          setTransactionEvent({
            sum:
              field && field.rent && field.rent.paymentMultiplier
                ? dices.sum * (field.price && field.rent.paymentMultiplier)
                : (field.owner && field.rent.baseRent) || 0,
            userId: player.userId,
            toUserId: whosField(),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          Action.payTaxModal();
        } else if (isJail()) {
          jailPlayer() && Action.switchPlayerTurn();
        } else if (isTax()) {
          // TODO написать нормальный текст на налоги
          setTransactionEvent({
            sum: field.price.startPrice,
            userId: player.userId,
            toUserId: whosField(),
            reason: 'Самое время заплатить налоги',
            transactionId: nanoid(4),
          });
          Action.payTaxModal();
        } else if (isChance()) {
          // TODO Make a real chance field action
          setTransactionEvent({
            sum: 1000,
            userId: player.userId,
            toUserId: whosField(),
            reason: 'Хитрый шанс',
            transactionId: nanoid(4),
          });
          Action.payTaxModal();
        }
      } else {
        if (player.unjailAttempts < JAIL_TURNS) {
          Action.switchPlayerTurn();
        } else {
          setTransactionEvent({
            sum: 500,
            userId: player.userId,
            toUserId: whosField(),
            reason: 'Залог за выход из тюрьмы',
            transactionId: nanoid(4),
          });
          Action.payUnJailModal();
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    if (isCompanyForSale() && canBuyField()) {
      Action.buyField();
      Action.switchPlayerTurn();
    } else {
      !isCompanyForSale() &&
        setError({
          code: ErrorCode.CompanyHasOwner,
          message: 'Oop!',
        });
      !canBuyField() &&
        setError({
          code: ErrorCode.NotEnoughMoney,
          message: 'Oop!',
        });
    }

    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    Action.startAuctionModal();
    Action.switchPlayerTurn();

    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    if (getCurrentTransaction().sum > -getActingPlayer().money) {
      transactMoneyEvent(getCurrentTransaction().transactionId);
      Action.switchPlayerTurn();
    } else {
      setError({
        code: ErrorCode.NotEnoughMoney,
        message: 'Oop!',
      });
    }
    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED)
  async unJailPayment(client: Socket, payload: IActionId): Promise<void> {
    unjailPlayer();
    BoardSocket.emitMessage();
    setTimeout(() => {
      Action.rollDicesModal();
      BoardSocket.emitMessage();
    }, LINE_TRANSITION_TIMEOUT * 2);
  }
}
