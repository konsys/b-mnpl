import {
  IncomeMessageType,
  OutcomeMessageType,
} from 'src/types/board/board.types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardService } from './board.service';
import { FieldsUtilsService } from './fields.utils.service';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import _ from 'lodash';
import { nanoid } from 'nanoid';

export interface ICurrentAction {
  action: OutcomeMessageType | IncomeMessageType;
  userId: number;
  actionId: string;
}

@Injectable()
export class ActionService {
  private logger: Logger = new Logger('ActionService');

  constructor(
    private readonly players: PlayersUtilsService,
    private readonly transaction: TransactionsService,
    private readonly boardService: BoardService,
    private readonly store: StoreService,
    @Inject(forwardRef(() => FieldsUtilsService))
    private readonly fields: FieldsUtilsService,
  ) {}

  async buyFieldModal(gameId: string, userId: number) {
    const player = await this.players.getActingPlayer(gameId);

    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_CAN_BUY_MODAL,
      userId: player.userId,
      actionId: nanoid(4),
    });
  }

  async buyField(gameId: string, fieldId: number, userId: number, sum: number) {
    // Field set to player
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getField(gameId, fieldId);

    await this.fields.buyCompany(f, p);

    // Decrease player`s money;
    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum,
      reason: `Купить ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  async unJailModal(gameId: string, userId: number) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async payUnJailModal(gameId: string, userId: number) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async payTaxModal(gameId: string, userId: number) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
      userId,
      actionId: nanoid(4),
    });
  }

  async rollDicesAction(gameId: string, userId: number) {
    const p = await this.players.getPlayer(gameId, userId);

    await this.store.setActionStore(p.gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: p.userId,
      actionId: nanoid(4),
    });
  }

  async rollDicesModal(gameId: string, userId: number) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async startAuctionModal(gameId: string, userId: number) {
    const actingPlayer = await this.players.getActingPlayer(gameId);
    const field = await this.fields.getActingField(gameId);
    const startPrice = field.price.startPrice;
    let auction = await this.store.getAuctionStore(gameId);
    const participants = _.filter(
      await this.players.getPlayersWealthierThan(gameId, startPrice),
      (v) => v !== actingPlayer.userId,
    );

    await this.store.setAuctionStore(gameId, {
      field,
      bet: startPrice + 100,
      isEnded: false,
      participants,
      userId: actingPlayer.userId,
    });
    if (!participants.length) {
      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, userId, false);
      return;
    }

    auction = await this.store.getAuctionStore(gameId);

    const curUserId = auction.participants[0];

    await this.store.setAuctionStore(gameId, {
      ...auction,
      participants,
      userId: curUserId,
    });
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId: curUserId,
      actionId: nanoid(4),
    });
  }

  async acceptAuctionModal(gameId: string, userId: number) {
    const p = await this.players.getPlayer(gameId, userId);
    const auction = await this.store.getAuctionStore(p.gameId);
    const nextUserId = this.getNextArrayValue(
      auction.userId,
      auction.participants,
    );

    await this.store.setAuctionStore(p.gameId, {
      ...auction,
      bet: auction.bet + BOARD_PARAMS.AUCTION_BET_INCREASE,
      userId: nextUserId,
    });
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId: nextUserId,
      actionId: nanoid(4),
    });
  }

  async declineAuctionModal(gameId: string, userId: number) {
    const auction = await this.store.getAuctionStore(gameId);
    const nextUserId = this.getNextArrayValue(
      auction.userId,
      auction.participants,
    );
    const f = await this.fields.getActingField(gameId);
    const p = await this.players.getPlayer(gameId, auction.userId);

    const participants = _.filter(
      auction.participants,
      (v) => v !== auction.userId,
    );

    if (participants.length < 2) {
      await this.buyField(gameId, f.fieldId, userId, auction.bet);

      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, userId, false);
      return;
    }

    await this.store.setAuctionStore(gameId, {
      ...auction,
      participants,
      userId: nextUserId,
    });

    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId: nextUserId,
      actionId: nanoid(4),
    });
  }

  async switchPlayerTurn(gameId: string, userId: number, unJail: boolean) {
    unJail = unJail ? unJail : false;
    const players = (await this.store.getPlayersStore(gameId)).players;
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
      nextIndex = this.getNextArrayIndex(index, players);
    }

    const res = players.map((v, k) => {
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
      ? await this.unJailModal(gameId, player.userId)
      : await this.rollDicesModal(gameId, player.userId);
  }

  async setPlayerActionEvent(gameId: string, playerActions: any) {
    await this.store.setActionStore(gameId, playerActions);
  }

  async getAction(gameId: string) {
    return await this.store.getActionStore(gameId);
  }

  private getNextArrayIndex(index: number, array: any[]) {
    return index < array.length - 1 ? index + 1 : 0;
  }

  private getNextArrayValue(value: any, array: any[]) {
    const index = _.findIndex(array, (v) => v === value);
    const ind = index < array.length - 1 ? index + 1 : 0;
    return array[ind];
  }
}
