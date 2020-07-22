import {
  IncomeMessageType,
  OutcomeMessageType,
} from 'src/types/board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardService } from './board.service';
import { FieldsUtilsService } from './fields.utils.service';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import { nanoid } from 'nanoid';
import _ from 'lodash';

export interface ICurrentAction {
  action: OutcomeMessageType | IncomeMessageType;
  userId: number;
  actionId: string;
}

@Injectable()
export class ActionService {
  constructor(
    private readonly players: PlayersUtilsService,
    private readonly transaction: TransactionsService,
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
    });
  }

  async buyField(gameId: string, fieldId: number, userId: number, sum: number) {
    // Field set to player
    const p = await this.players.getPlayer(gameId, userId);
    const f = await this.fields.getField(gameId, fieldId);

    await this.fields.buyCompany(gameId, f, p);

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

  async unJailModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UN_JAIL_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async payUnJailModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_UNJAIL_PAYING_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async payTaxModal(gameId: string, playerId: number) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_TAX_PAYING_MODAL,
      userId: playerId,
      actionId: nanoid(4),
    });
  }

  async rollDicesAction(gameId: string) {
    const p = await this.players.getActingPlayer(gameId);
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_ACTION,
      userId: p.userId,
      actionId: nanoid(4),
    });
  }

  async rollDicesModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async startAuctionModal(gameId: string) {
    const actingPlayer = await this.players.getActingPlayer('kkk');
    const field = await this.fields.getActingField('kkk');
    const startPrice = field.price.startPrice;
    let auction = await this.store.getAuctionStore('kkk');
    const participants = _.filter(
      await this.players.getPlayersWealthierThan('kkk', startPrice),
      (v) => v !== actingPlayer.userId,
    );

    await this.store.setAuctionStore('kkk', {
      field,
      bet: startPrice + 100,
      isEnded: false,
      participants,
      userId: actingPlayer.userId,
    });
    if (!participants.length) {
      await this.store.flushAuctionStore('kkk');
      await this.switchPlayerTurn('kkk', false);
      return;
    }

    auction = await this.store.getAuctionStore('kkk');

    const userId = auction.participants[0];

    await this.store.setAuctionStore(gameId, {
      ...auction,
      participants,
      userId,
    });
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId,
      actionId: nanoid(4),
    });
  }

  async acceptAuctionModal(gameId: string) {
    const auction = await this.store.getAuctionStore('kkk');
    const userId = this.getNextArrayValue(auction.userId, auction.participants);

    await this.store.setAuctionStore('kkk', {
      ...auction,
      bet: auction.bet + BOARD_PARAMS.AUCTION_BET_INCREASE,
      userId,
    });
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId,
      actionId: nanoid(4),
    });
  }

  async declineAuctionModal(gameId: string) {
    const auction = await this.store.getAuctionStore('kkk');
    const userId = this.getNextArrayValue(auction.userId, auction.participants);
    const f = await this.fields.getActingField('kkk');
    const p = await this.players.getPlayer('kkk', auction.userId);

    const participants = _.filter(
      auction.participants,
      (v) => v !== auction.userId,
    );

    if (participants.length < 2) {
      await this.buyField(gameId, f.fieldId, userId, auction.bet);

      await this.store.flushAuctionStore('kkk');
      await this.switchPlayerTurn('kkk', false);
      return;
    }

    await this.store.setAuctionStore('kkk', {
      ...auction,
      participants,
      userId,
    });

    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_AUCTION_MODAL,
      userId,
      actionId: nanoid(4),
    });
  }

  async switchPlayerTurn(gameId: string, unJail: boolean) {
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
      await this.players.updatePlayer(
        gameId,
        {
          ...player,
          movesLeft: --player.movesLeft,
        },
        'switchTurn',
      );
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
      ? await this.unJailModal(gameId)
      : await this.rollDicesModal(gameId);
  }

  async setPlayerActionEvent(gameId: string, playerActions: any) {
    const prev = await this.store.getActionStore(gameId);
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
