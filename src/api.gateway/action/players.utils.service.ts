import { IPlayer, OutcomeMessageType } from 'src/types/Board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { Injectable } from '@nestjs/common';
import { StoreService } from './store.service';
import { nanoid } from 'nanoid';

const bank: IPlayer = {
  userId: BOARD_PARAMS.BANK_PLAYER_ID,
  money: 100000,
  password: 'bank',
  vip: true,
  registrationType: 'none',
  name: 'BANK',
  email: 'b@b.ru',
  team: null,
  avatar: '',
  createdAt: new Date('2020-06-17T12:08:38.000Z'),
  updatedAt: new Date('2020-06-17T12:08:38.000Z'),
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
export class PlayersUtilsService {
  constructor(private readonly store: StoreService) {}

  onModuleInit() {
    this.store.setBankStore('bankStore', bank);
  }

  async getPlayerById(gameId: string, userId: number): Promise<IPlayer> {
    const bank = await this.store.getBankStore(gameId);
    const players = await this.store.getPlayersStore(gameId);
    return userId === BOARD_PARAMS.BANK_PLAYER_ID
      ? bank
      : players.players.find((v) => v.userId === userId);
  }

  async getActingPlayer(gameId: string): Promise<IPlayer> {
    const state = await this.store.getBankStore(gameId);
    const user = Array.isArray(state) && state.find((v) => v.isActing);
    return user;
  }

  async getActingPlayerIndex(gameId: string): Promise<number> {
    const state = await this.store.getBankStore(gameId);
    const index = Array.isArray(state) && state.findIndex((v) => v.isActing);
    return index;
  }

  async getPlayerIndexById(gameId: string, userId: number) {
    const state = await this.store.getBankStore(gameId);
    return Array.isArray(state) && state.findIndex((v) => v.userId === userId);
  }

  async getPlayerMoneyById(gameId: string, userId: number): Promise<number> {
    const state = await this.store.getBankStore(gameId);
    const player =
      Array.isArray(state) && state.find((v) => v.userId === userId);
    return (player && player.money) || 0;
  }

  async unjailPlayer(gameId: string, newPosition?: number) {
    const player = await this.getActingPlayer(gameId);
    // After clicking unjail for money till show roll dices modal
    await this.store.setActionStore(gameId, {
      action: OutcomeMessageType.DO_NOTHING,
      actionId: nanoid(4),
      moveId: 1,
      userId: player.userId,
    });

    return this.updatePlayer(gameId, {
      ...player,
      // if there is position then unjailed by rolling dices
      money: newPosition
        ? player.money
        : player.money - BOARD_PARAMS.UN_JAIL_PRICE,
      meanPosition: newPosition || BOARD_PARAMS.JAIL_POSITION,
      jailed: 0,
      unjailAttempts: 0,
    });
  }

  async jailPlayer(gameId: string): Promise<boolean> {
    const player = await this.getActingPlayer(gameId);
    return await this.updatePlayer(gameId, {
      ...player,
      jailed: BOARD_PARAMS.JAIL_TURNS,
      unjailAttempts: 0,
      doublesRolledAsCombo: 0,
      movesLeft: 0,
      meanPosition: BOARD_PARAMS.JAIL_POSITION,
    });
  }

  async updatePlayer(gameId: string, player: IPlayer): Promise<boolean> {
    // Update BANK
    if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
      return this.store.setBankStore(gameId, player) && true;
    }

    const playersState = await this.store.getPlayersStore(gameId);
    const currentPLayerIndex = await this.getPlayerIndexById(
      gameId,
      player.userId,
    );

    // TODO error handler
    if (currentPLayerIndex === -1)
      throw Error(`Not found player with id: ${player.userId}`);

    playersState.players[currentPLayerIndex] = player;

    return await this.updateAllPLayers(gameId, playersState.players);
  }

  async updateAllPLayers(gameId: string, players: IPlayer[]): Promise<boolean> {
    let state = await this.store.getPlayersStore(gameId);
    await this.store.setPlayersStore(gameId, {
      players,
      version: ++state.version,
    });
    return true;
  }
}
