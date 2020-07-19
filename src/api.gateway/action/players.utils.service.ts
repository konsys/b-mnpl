import { IPlayer, OutcomeMessageType } from 'src/types/Board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { Injectable } from '@nestjs/common';
import { StoreService } from './store.service';
import { nanoid } from 'nanoid';

@Injectable()
export class PlayersUtilsService {
  constructor(private readonly store: StoreService) {}

  async getPlayerById(gameId: string, userId: number): Promise<IPlayer> {
    const bank = await this.store.getBankStore(gameId);
    const players = await this.getPlayers(gameId);
    return userId === BOARD_PARAMS.BANK_PLAYER_ID
      ? bank
      : players.find((v) => v.userId === userId);
  }

  async getActingPlayer(gameId: string): Promise<IPlayer> {
    const players = await this.getPlayers(gameId);
    const acting = players.find((v) => v.isActing);

    return acting;
  }

  async getActingPlayerIndex(gameId: string): Promise<number> {
    const state = await this.getPlayers(gameId);

    const index = state.findIndex((v) => v.isActing);
    return index;
  }

  async getPlayerIndexById(gameId: string, userId: number) {
    const state = await this.getPlayers(gameId);
    return state.findIndex((v) => v.userId === userId);
  }

  async getPlayerMoneyById(gameId: string, userId: number): Promise<number> {
    const state = await this.getPlayers(gameId);
    const player = state.find((v) => v.userId === userId);
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

    return await this.updatePlayer(
      gameId,
      {
        ...player,
        // if there is position then unjailed by rolling dices
        money: newPosition
          ? player.money
          : player.money - BOARD_PARAMS.UN_JAIL_PRICE,
        meanPosition: newPosition || BOARD_PARAMS.JAIL_POSITION,
        jailed: 0,
        unjailAttempts: 0,
      },
      'unjail',
    );
  }

  async jailPlayer(gameId: string): Promise<boolean> {
    const player = await this.getActingPlayer(gameId);
    return await this.updatePlayer(
      gameId,
      {
        ...player,
        jailed: BOARD_PARAMS.JAIL_TURNS,
        unjailAttempts: 0,
        doublesRolledAsCombo: 0,
        movesLeft: 0,
        meanPosition: BOARD_PARAMS.JAIL_POSITION,
      },
      'jail',
    );
  }

  async updatePlayer(
    gameId: string,
    player: IPlayer,
    where: string,
  ): Promise<boolean> {
    // Update BANK
    if (player.userId === BOARD_PARAMS.BANK_PLAYER_ID) {
      await this.store.setBankStore(gameId, player);
      return true;
    }

    const players = await this.getPlayers(gameId);

    const currentPLayerIndex = await this.getPlayerIndexById(
      gameId,
      player.userId,
    );

    // TODO error handler
    if (currentPLayerIndex === -1)
      throw Error(`Not found player with id: ${player.userId}`);

    players[currentPLayerIndex] = player;
    return await this.updateAllPLayers(gameId, players);
  }

  async updateAllPLayers(gameId: string, players: IPlayer[]): Promise<boolean> {
    await this.store.setPlayersStore(gameId, {
      players,
    });

    return true;
  }

  private async getPlayers(gameId: string): Promise<IPlayer[]> {
    const playersState = await this.store.getPlayersStore(gameId);
    return playersState ? playersState.players : [];
  }
}
