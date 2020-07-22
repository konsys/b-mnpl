import { BoardMessage, IPlayer } from 'src/types/board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { Injectable } from '@nestjs/common';
import { StoreService } from './store.service';

const bank: IPlayer = {
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 1000000,
  password: 'bank',
  vip: true,
  registrationType: 'none',
  name: 'BANK',
  email: 'b@b.ru',
  team: null,
  avatar: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: false,
  isBlocked: true,
  isActing: false,
  gameId: '',
  doublesRolledAsCombo: 0,
  jailed: 0,
  unjailAttempts: 0,
  meanPosition: 0,
  creditPayRound: false,
  creditNextTakeRound: 0,
  score: 0,
  additionalTime: 0,
  timeReduceLevel: 0,
  creditToPay: 0,
  canUseCredit: false,
  moveOrder: 0,
  isAlive: false,
  movesLeft: 0,
};
@Injectable()
export class BoardService {
  constructor(private readonly store: StoreService) {}

  async setNewRoundEvent(gameId: string) {
    const prev = await this.store.getBoardStore(gameId);

    await this.store.setBoardStore(gameId, {
      isNewRound: true,
      gameRound: ++prev.gameRound,
      playersTurn: ++prev.playersTurn,
      playerActions: [],
    });
  }

  async setNewTurnEvent(gameId: string) {
    const prev = await this.store.getBoardStore(gameId);

    await this.store.setBoardStore(gameId, {
      isNewRound: false,
      gameRound: prev.gameRound,
      playersTurn: ++prev.playersTurn,
      playerActions: [],
    });
  }

  async setNextRound(gameId: string) {
    const prev = await this.store.getBoardStore(gameId);

    await this.store.setBoardStore(gameId, {
      ...prev,
      isNewRound: false,
      playersTurn: ++prev.playersTurn,
    });
  }

  async initStores(gameId: string) {
    this.store;
    try {
      // const fields: IField[] = await this.fieldsService.getInitialFields();

      // const r = fields.map((v: IField, k) => ({
      //   ...v,
      //   status: v.type === FieldType.COMPANY &&
      //     v.fieldGroup === 1 &&
      //     k < 4 && {
      //       fieldId: v.fieldId,
      //       userId: 2,
      //       branches: 0,
      //       mortgaged: 0,
      //       fieldActions: [IFieldAction.MORTGAGE],
      //     },
      // }));

      // await this.fields.updateAllFields(gameId, r);

      await this.store.setBoardStore(gameId, {
        isNewRound: false,
        gameRound: 0,
        playersTurn: 0,
        playerActions: [],
      });
      this.store.setBankStore('kkk', bank);

      // const ch = `kkk-${ERROR_CHANEL}`;
      // errorSubscriber.on('message', async (chanel: any, message: string) => {
      //   await this.emitError(JSON.parse(message));
      // });
      // errorSubscriber.subscribe(ch);
    } catch (err) {}
  }
}
