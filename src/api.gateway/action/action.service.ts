import {
  IncomeMessageType,
  OutcomeMessageType,
} from 'src/types/Board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardService } from './board.service';
import { FieldsService } from '../fields/fields.service';
import { FieldsUtilsService } from './fields.utils.service';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionService } from './transaction.service';
import { nanoid } from 'nanoid';

export interface ICurrentAction {
  action: OutcomeMessageType | IncomeMessageType;
  userId: number;
  actionId: string;
  moveId: number;
}

@Injectable()
export class ActionService {
  constructor(
    private readonly players: PlayersUtilsService,
    private readonly transaction: TransactionService,
    private readonly boardService: BoardService,
    private readonly store: StoreService,
    @Inject(forwardRef(() => FieldsUtilsService))
    private readonly fields: FieldsUtilsService,
  ) {}

  async buyFieldModal(gameId: string) {
    const player = await this.players.getActingPlayer(gameId);
    const action = await this.store.getActionStore(gameId);
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
      userId: player.userId,
      actionId: nanoid(4),
      moveId: action.moveId + 1,
    });
  }

  async buyField(gameId: string) {
    // Field set to player
    const user = await this.players.getActingPlayer(gameId);
    const field = await this.fields.findFieldByPosition(
      gameId,
      user.meanPosition,
    );
    let sum = field.price.startPrice;

    sum = await this.fields.buyCompany(gameId, field);

    // Decrease player`s money;
    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum,
      reason: `Купить ${field.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: user.userId,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  async unJailModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async payUnJailModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async payTaxModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async rollDicesAction(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async rollDicesModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async startAuctionModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
      moveId: ++(await this.store.getActionStore(gameId)).moveId,
    });
  }

  async switchPlayerTurn(gameId: string, unJail: boolean) {
    unJail = unJail ? unJail : false;
    const store = await this.store.getPlayersStore(gameId);
    const index = await this.players.getActingPlayerIndex(gameId);
    let player = await this.players.getActingPlayer(gameId);
    let nextIndex = index;

    if (index === 0) {
      await this.boardService.setNewRoundEvent(gameId);
    } else {
      await this.boardService.setNewTurnEvent(gameId);
    }
    // Set Next round
    nextIndex === 0 && (await this.fields.mortgageNextRound(gameId));

    // Doubled dices and jail
    if (player.movesLeft > 0) {
      nextIndex = index;
      await this.players.updatePlayer(gameId, {
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

    await this.players.updateAllPLayers(gameId, res);
    player = await this.players.getActingPlayer(gameId);
    player.jailed
      ? await this.unJailModal(gameId)
      : await this.rollDicesModal(gameId);
  }

  async setPlayerActionEvent(gameId: string, playerActions: any) {
    const prev = await this.store.getActionStore(gameId);
    await this.store.setActionStore(gameId, playerActions);
  }

  private getNextArrayIndex(index: number, array: any[]) {
    return index < array.length - 1 ? index + 1 : 0;
  }
}
