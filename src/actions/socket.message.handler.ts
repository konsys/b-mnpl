import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IPlayerMove, IncomeMessageType } from 'src/types/board.types';
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
} from 'src/utils/fields.utils';
import * as Action from 'src/utils/actions.utils';
import { setError } from 'src/stores/error.store';
import { ErrorCode } from 'src/utils/error.code';
import {
  moneyTransaction,
  getActingPlayer,
  unJailPlayer,
  goToJail,
} from 'src/utils/users.utils';
import { START_BONUS } from 'src/utils/board.params.utils';
import { BoardSocket } from 'src/modules/socket/board.init';

@WebSocketGateway()
export class BoardMessage {
  @SubscribeMessage(IncomeMessageType.INCOME_ROLL_DICES_CLICKED)
  async dicesModal(client: Socket, payload: IActionId): Promise<void> {
    Action.rollDicesAction();
    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_PLAYER_TOKEN_TRANSITION_COMPLETED)
  async dicesRolled(client: Socket, payload: IPlayerMove): Promise<void> {
    const player = getActingPlayer();

    if (!player.jailed) {
      noActionField() && Action.switchPlayerTurn();

      isCompanyForSale() && Action.buyFieldModalAction();

      isJail() && goToJail() && Action.switchPlayerTurn();

      isStart() &&
        moneyTransaction({
          sum: START_BONUS,
          userId: player.userId,
          toUserId: 0,
        }) &&
        Action.switchPlayerTurn();

      isTax() && Action.payTaxModalAction();

      isChance() &&
        moneyTransaction({
          sum: 50000,
          userId: player.userId,
          toUserId: 0,
        }) &&
        Action.payTaxModalAction();
    }

    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_BUY_FIELD_CLICKED)
  async fieldBought(client: Socket, payload: IActionId): Promise<void> {
    if (isCompanyForSale() && canBuyField()) {
      Action.buyFieldAction();
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

    Action.switchPlayerTurn();
    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_AUCTION_START_CLICKED)
  async fieldAuction(client: Socket, payload: IActionId): Promise<void> {
    Action.startAuctionAction();
    Action.switchPlayerTurn();

    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_TAX_PAID_CLICKED)
  async payment(client: Socket, payload: IActionId): Promise<void> {
    moneyTransaction(moneyTransactionParams());

    Action.switchPlayerTurn();
    BoardSocket.emitMessage();
  }

  @SubscribeMessage(IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED)
  async unjailPayment(client: Socket, payload: IActionId): Promise<void> {
    unJailPlayer();
    Action.rollDicesModalAction();
    BoardSocket.emitMessage();
  }
}
