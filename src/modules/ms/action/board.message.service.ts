import { BoardMessage, IField, IPlayer } from 'src/types/board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { FieldsUtilsService } from './fields.utils.service';
import { IBoardEvent } from 'src/types/board/board.types';
import { Injectable, Inject } from '@nestjs/common';
import { MsPatterns, MsNames } from 'src/types/ms/ms.types';
import { OutcomeMessageService } from './outcome-message.service';
import { StoreService } from './store.service';
import { ClientProxy } from '@nestjs/microservices';

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
export class BoardMessageService {
  constructor(
    private readonly fields: FieldsUtilsService,
    private readonly store: StoreService,
    private readonly outcomeMessage: OutcomeMessageService,
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

    const message: BoardMessage = {
      code: 0,
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

  async onModuleInit() {
    const message = await this.createBoardMessage('kkk');

    await this.store.sendMessage('kkk', message);
  }

  async initStores(gameId: string) {
    this.store;
    try {
      const res = await this.fieldsMs
        .send<any>({ cmd: MsPatterns.GET_INIT_FIELDS }, {})
        .toPromise();

      console.log(23424234, res);
      // return res;

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
