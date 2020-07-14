import { Injectable } from '@nestjs/common';
import {
  OutcomeMessageType,
  IncomeMessageType,
} from 'src/types/Board/board.types';
import { nanoid } from 'nanoid';
import { setNewRoundEvent, setNewTurnEvent } from 'src/stores/board.store';
import { UsersService } from '../users/users.service';
import { FieldsService } from '../fields/fields.service';
import { redis } from 'src/main';
import { BOARD_PARAMS } from 'src/params/board.params';
import { TransactionService } from '../transaction/transaction.service';

export interface ICurrentAction {
  action: OutcomeMessageType | IncomeMessageType;
  userId: number;
  actionId: string;
  moveId: number;
}

@Injectable()
export class ActionService {
  constructor(
    private readonly usersService: UsersService,
    private readonly fieldsService: FieldsService,
    private readonly transactionService: TransactionService,
  ) {}

  async setActionStore(gameId: string, board: ICurrentAction) {
    await redis.set(`${gameId}-board`, JSON.stringify(board));
  }

  async getActionStore(gameId: string): Promise<ICurrentAction> {
    return JSON.parse(await redis.get(`${gameId}-board`)) as ICurrentAction;
  }

  async buyFieldModal(gameId: string) {
    const player = await this.usersService.getActingPlayer(gameId);
    const action = await this.getActionStore(gameId);
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
      userId: player.userId,
      actionId: nanoid(4),
      moveId: action.moveId + 1,
    });
  }

  async buyField(gameId: string) {
    // Field set to player
    const user = await this.usersService.getActingPlayer(gameId);
    const field = await this.fieldsService.findFieldByPosition(
      gameId,
      user.meanPosition,
    );
    let sum = field.price.startPrice;

    sum = await this.fieldsService.buyCompany(gameId, field);

    // Decrease player`s money;
    const transactionId = nanoid(4);
    await this.transactionService.setTransaction(gameId, {
      sum,
      reason: `Купить ${field.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: user.userId,
    });
    await this.transactionService.transactMoney(gameId, transactionId);
  }

  async unJailModal(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
      userId: (await this.usersService.getActingPlayer('kkk')).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async payUnJailModal(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.usersService.getActingPlayer('kkk')).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async payTaxModal(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
      userId: (await this.usersService.getActingPlayer('kkk')).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async rollDicesAction(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: (await this.usersService.getActingPlayer('kkk')).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async rollDicesModal(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
      userId: (await this.usersService.getActingPlayer('kkk')).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async startAuctionModal(gameId: string) {
    await this.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId: (await this.usersService.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.getActionStore(gameId)).moveId,
    });
  }

  async switchPlayerTurn(gameId: string, unJail: boolean) {
    unJail = unJail ? unJail : false;
    const store = await this.usersService.getPlayersStore(gameId);
    const index = await this.usersService.getActingPlayerIndex(gameId);
    let player = await this.usersService.getActingPlayer(gameId);
    let nextIndex = index;

    if (index === 0) {
      setNewRoundEvent();
    } else {
      setNewTurnEvent();
    }
    // Set Next round
    nextIndex === 0 && (await this.fieldsService.mortgageNextRound(gameId));

    // Doubled dices and jail
    if (player.movesLeft > 0) {
      nextIndex = index;
      await this.usersService.updatePlayer(gameId, {
        ...player,
        movesLeft: --player.movesLeft,
      });
    } else {
      nextIndex = await this.getNextArrayIndex(index, store.players);
    }

    const res = store.players.map((v, k) => {
      if (k === nextIndex) {
        if (unJail) {
          v.movesLeft = 0;
          v.jailed = 0;
          v.unjailAttempts = 0;
        }
        return { ...v, isActing: true };
      } else {
        return { ...v, isActing: false };
      }
    });

    await this.usersService.updateAllPLayers(gameId, res);
    player = await this.usersService.getActingPlayer(gameId);
    player.jailed
      ? await this.unJailModal(gameId)
      : await this.rollDicesModal(gameId);
  }

  getNextArrayIndex(index: number, array: any[]) {
    return index < array.length - 1 ? index + 1 : 0;
  }
}
