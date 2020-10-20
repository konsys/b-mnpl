import {
  BoardMessage,
  IField,
  IPlayer,
  IFieldAction,
  OutcomeMessageType,
} from 'src/types/board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { FieldsUtilsService } from './fields.utils.service';
import { IBoardEvent } from 'src/types/board/board.types';
import { Injectable, Inject } from '@nestjs/common';
import { MsNames, MsFieldsPatterns } from 'src/types/ms/ms.types';
import { OutcomeMessageService } from './outcome-message.service';
import { StoreService } from './store.service';
import { ClientProxy } from '@nestjs/microservices';
import { FieldType } from 'src/entities/board.fields.entity';
import { nanoid } from 'nanoid';
import { UsersEntity } from 'src/entities/users.entity';
import { PlayersUtilsService } from './players.utils.service';

const bankInit: IPlayer = {
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
  inventory: [],
};
@Injectable()
export class BoardMessageService {
  constructor(
    private readonly fields: FieldsUtilsService,
    private readonly store: StoreService,
    private readonly outcomeMessage: OutcomeMessageService,
    private readonly players: PlayersUtilsService,
    @Inject(MsNames.FIELDS)
    private readonly fieldsMs: ClientProxy,
  ) {}

  async createBoardMessage(gameId: string): Promise<BoardMessage> {
    const actionState = await this.store.getActionStore(gameId);

    let event: IBoardEvent = {
      // Adapt from actionStore to send to client
      action:
        actionState &&
        (await this.outcomeMessage.actionTypeToEventAdapter(
          gameId,
          actionState.action,
        )),
    };
    const players = await this.store.getPlayersStore(gameId);
    const error = await this.store.getError(gameId);

    const message: BoardMessage = {
      code: (error && error.code) || 0,
      data: {
        id: 0,
        event,
        boardStatus: {
          players: players ? players.players : [],
          fields: (await this.fields.getBoughtFields(gameId)) || [],
        },
      },
    };

    return message;
  }

  async initStores(gameId: string): Promise<boolean> {
    const bankStore = await this.store.getBankStore(gameId);

    if (bankStore) {
      // Game initialized;
      return true;
    }
    try {
      const fields = await this.fieldsMs
        .send<any>({ cmd: MsFieldsPatterns.GET_INIT_FIELDS }, {})
        .toPromise();

      const r = fields.map((v: IField, k: number) => ({
        ...v,
        status: v.type === FieldType.COMPANY &&
          v.fieldGroup === 1 &&
          k < 4 && {
            fieldId: v.fieldId,
            userId: 2,
            branches: 0,
            mortgaged: 0,
            fieldActions: [IFieldAction.MORTGAGE],
          },
      }));

      await this.fields.updateAllFields(gameId, r);

      await this.store.setBoardStore(gameId, {
        isNewRound: false,
        gameRound: 0,
        playersTurn: 0,
        playerActions: [],
      });
      await this.store.setBankStore(gameId, bankInit);
      return false;
    } catch (err) {
      console.log('ERROR ', err);
    }
  }

  async initPlayers(gameId: string, players: UsersEntity[]) {
    const resultPlayers = [];
    if (players && players.length > 0) {
      // Случайная очередь ходов
      const ids = players.map((v) => v.userId).sort(() => Math.random() - 0.5);

      // Заполняем статус
      players = players.map((v, k) => {
        v = new UsersEntity(v);
        return {
          ...v,
          gameId,
          doublesRolledAsCombo: 0,
          jailed: 0,
          unjailAttempts: 0,
          meanPosition: 0,
          money: BOARD_PARAMS.INIT_MONEY,
          creditPayRound: false,
          creditNextTakeRound: 0,
          score: 0,
          timeReduceLevel: 0,
          creditToPay: 0,
          frags: '',
          additionalTime: 0,
          canUseCredit: v.vip,
          moveOrder: ids.findIndex((id) => id === v.userId),
          isActing: ids[0] === v.userId,
          movesLeft: ids[0] === v.userId ? 1 : 0,
        };
      });

      // Заполняем массив в порядке очереди ходов
      ids.map((id) => {
        resultPlayers.push(players.find((v) => v.userId === id));
      });

      await this.store.setActionStore(gameId, {
        action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
        userId: resultPlayers.find((v) => v.moveOrder === 0).userId,
        actionId: nanoid(4),
      });
    }

    await this.players.updateAllPLayers(gameId, resultPlayers);

    return (await this.store.getPlayersStore(gameId)).players;
  }
}
