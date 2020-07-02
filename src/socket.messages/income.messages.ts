import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomeMessageType, IFieldId } from 'src/types/Board/board.types';
import { Socket } from 'socket.io';
import { IActionId } from 'src/types/Board/board.types';
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
  isCompany,
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
import {
  setTransactionEvent,
  transactMoneyEvent,
  getCurrentTransaction,
} from 'src/stores/transactions.store';
import { nanoid } from 'nanoid';
import { getCurrentAction } from 'src/stores/actions.store';
import { dicesStore } from 'src/stores/dices.store';
import { BOARD_PARAMS } from 'src/params/board.params';
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
      }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 3);
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
        } else if (isMyField(field.fieldId)) {
          Action.switchPlayerTurn();
        } else if (isCompanyForSale(field.fieldId)) {
          Action.buyFieldModal();
        } else if (
          !isCompanyForSale(field.fieldId) &&
          isMyField(field.fieldId)
        ) {
          Action.switchPlayerTurn();
        } else if (whosField() && !isMyField(field.fieldId)) {
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
        if (player.unjailAttempts < BOARD_PARAMS.JAIL_TURNS) {
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
    const field = getActingField();
    if (isCompanyForSale(field.fieldId) && canBuyField()) {
      Action.buyField();
      Action.switchPlayerTurn();
    } else {
      !isCompanyForSale(field.fieldId) &&
        setError({
          code: ErrorCode.CompanyHasOwner,
          message: 'Oops!',
        });
      !canBuyField() &&
        setError({
          code: ErrorCode.NotEnoughMoney,
          message: 'Oops!',
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
        message: 'Oops!',
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
    }, BOARD_PARAMS.LINE_TRANSITION_TIMEOUT * 2);
  }

  @SubscribeMessage(IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED)
  async mortgageField(client: Socket, payload: IFieldId): Promise<void> {
    if (!isMyField(payload.fieldId)) {
      setError({
        code: ErrorCode.NotUserField,
        message: 'Oops!',
      });
      console.log(11);
    } else if (!isCompany()) {
      setError({
        code: ErrorCode.CannotMortgageField,
        message: 'Oops!',
      });
      console.log(22);
    } else {
      Action.mortgageField();
      console.log(33);
    }
    BoardSocket.emitMessage();
  }
}
