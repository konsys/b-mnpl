import { Injectable } from '@nestjs/common';
import { StoreService } from './store.service';

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
}
