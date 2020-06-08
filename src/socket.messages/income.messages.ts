import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomeMessageType } from 'src/types/board.types';
import { Socket } from 'socket.io';
import { IActionId } from 'src/types/board.types';
import {
  isCompanyForSale,
  canBuyField,
  isTax,
  isStart,
  moneyTransactionParams,
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
import { getActingPlayer, unjailPlayer, goToJail } from 'src/utils/users.utils';
// import { START_BONUS } from 'src/utils/board.params.utils';
import { BoardSocket } from 'src/modules/socket/board.init';
import { LINE_TRANSITION_TIMEOUT } from 'src/types/board.params';
import {
  setTransactionEvent,
  transactMoneyEvent,
  getCurrentTransaction,
} from 'src/stores/transactions.store';
import nanoid from 'nanoid';
import { getCurrentAction } from 'src/stores/actions.store';

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

      if (!player.jailed) {
        if (noActionField()) {
          Action.switchPlayerTurn();
        }
        if (isCompanyForSale()) {
          Action.buyFieldModal();
        }
        if (!isCompanyForSale() && isMyField()) {
          Action.switchPlayerTurn();
        }
        if (!isCompanyForSale() && !isMyField()) {
          const field = getActingField();
          setTransactionEvent({
            money: -(field.owner && field.owner.updatedPrice) || 0,
            userId: player.userId,
            toUserId: whosField(),
            reason: 'Пришло время платить по счетам',
            transactionId: nanoid(4),
          });
          Action.payTaxModal();
        }
        if (isJail()) {
          goToJail() && Action.switchPlayerTurn();
        }
        if (isStart()) {
          Action.switchPlayerTurn();
        }
        if (isTax()) {
          Action.payTaxModal();
        }
        if (isChance()) {
          // TODO Make a real chance field action
          setTransactionEvent({
            money: -5000,
            userId: player.userId,
            toUserId: 0,
            reason: 'Надо купить бетон',
            transactionId: nanoid(4),
          });
          Action.payTaxModal();
        }
      } else {
        Action.switchPlayerTurn();
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
    if (getCurrentTransaction().money > -getActingPlayer().money) {
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
