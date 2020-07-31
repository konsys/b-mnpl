import {
  IncomeMessageType,
  OutcomeMessageType,
  IContract,
} from 'src/types/board/board.types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { BOARD_PARAMS } from 'src/params/board.params';
import { BoardService } from './board.service';
import { FieldsUtilsService } from './fields.utils.service';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';
import _, { takeRight } from 'lodash';
import { nanoid } from 'nanoid';

const https = require('https');
const fs = require('fs');
const path = require('path');

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

  async buyFieldModal(gameId: string) {
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

  async payTaxModal(gameId: string, userId: number) {
    await this.saveImg(gameId);
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

  async rollDicesModal(gameId: string) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
      userId: (await this.players.getActingPlayer(gameId)).userId,
      actionId: nanoid(4),
    });
  }

  async startAuctionModal(gameId: string) {
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
      userAccepted: 0,
      participants,
      userId: actingPlayer.userId,
    });
    if (!participants.length) {
      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, false);
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

    if (auction.participants.length < 2) {
      await this.buyField(gameId, auction.field.fieldId, userId, auction.bet);

      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, false);
      return;
    }

    await this.store.setAuctionStore(p.gameId, {
      ...auction,
      userAccepted: userId,
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

    const participants = _.filter(
      auction.participants,
      (v) => v !== auction.userId,
    );

    if (auction.userAccepted && participants.length < 2) {
      await this.buyField(gameId, f.fieldId, auction.userAccepted, auction.bet);

      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, false);
      return;
    } else if (participants.length < 2) {
      await this.store.flushAuctionStore(gameId);
      await this.switchPlayerTurn(gameId, false);
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

  async contractModal(gameId: string, contract: IContract) {
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.OUTCOME_CONTRACT_MODAL,
      userId: contract.toUserId,
      actionId: nanoid(4),
    });
  }

  async acceptContract(gameId: string, contract: IContract) {
    const allFields = (await this.store.getFieldsStore(gameId)).fields;
    for (const id of contract.fieldIdsFrom) {
      const f = await this.fields.getField(gameId, id);
      await this.fields.updateField(gameId, {
        ...f,
        status: { ...f.status, userId: contract.toUserId },
      });
    }

    for (const id of contract.fieldIdsTo) {
      const f = await this.fields.getField(gameId, id);
      await this.fields.updateField(gameId, {
        ...f,
        status: { ...f.status, userId: contract.fromUserId },
      });
    }
    const transactionId = nanoid(4);
    if (contract.moneyFrom > 0) {
      await this.store.setTransaction(gameId, {
        sum: contract.moneyFrom,
        reason: ``,
        toUserId: contract.toUserId,
        transactionId,
        userId: contract.fromUserId,
      });
      await this.transaction.transactMoney(gameId, transactionId);
    }
    if (contract.moneyFrom > 0 || contract.moneyTo > 0) {
      await this.store.setTransaction(gameId, {
        sum: contract.moneyTo,
        reason: ``,
        toUserId: contract.fromUserId,
        transactionId,
        userId: contract.toUserId,
      });
      await this.transaction.transactMoney(gameId, transactionId);
    }
  }

  async switchPlayerTurn(gameId: string, unJail: boolean) {
    unJail = unJail ? unJail : false;
    const players = (await this.store.getPlayersStore(gameId)).players;
    const index = await this.players.getActingPlayerIndex(gameId);

    let player = await this.players.getActingPlayer(gameId);
    let nextIndex = this.getNextArrayIndex(index, players);

    if (nextIndex === 0 && index !== 0) {
      await this.boardService.setNewRoundEvent(gameId);
      await this.fields.mortgageNextRound(gameId);
    } else {
      await this.boardService.setNewTurnEvent(gameId);
    }

    if (player.movesLeft > 0) {
      nextIndex = index;
      await this.players.updatePlayer(gameId, {
        ...player,
        movesLeft: --player.movesLeft,
      });
    }

    const res = players.map((v, k) => {
      if (k === nextIndex) {
        if (unJail) {
          v.jailed = 0;
          v.unjailAttempts = 0;
        }
        return { ...v, isActing: true, movesLeft: 1 };
      } else {
        return { ...v, isActing: false, movesLeft: 0 };
      }
    });

    await this.players.updateAllPLayers(gameId, res);
    player = await this.players.getActingPlayer(gameId);

    !!player.jailed
      ? await this.unJailModal(gameId)
      : await this.rollDicesModal(gameId);
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

  private async saveImg(gameId: string) {
    const fields = (await this.store.getFieldsStore(gameId)).fields;

    for (const f of fields) {
      const sp = f.imgSrc.split('/');
      const jn = sp.length > 2 && takeRight(sp, 2).join('/');
      const path2 = '/home/sysuev/projects/b-mnpl/assets/f/' + jn;

      console.log(1111, path2);
      if (path.basename(f.imgSrc)) {
        const file = await fs.createWriteStream(path2);
        const request = await https.get(f.imgSrc, function (response) {
          response.pipe(file);
        });
      }
    }
  }
}
