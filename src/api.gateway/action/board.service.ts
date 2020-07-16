import { Injectable } from '@nestjs/common';
import { redis } from 'src/main';
import { IBoardStore } from './store.service';

@Injectable()
export class BoardService {
  async setBoardStore(gameId: string, board: IBoardStore) {
    await redis.set(`${gameId}-board`, JSON.stringify(board));
  }

  async getBoardStore(gameId: string): Promise<IBoardStore> {
    return JSON.parse(await redis.get(`${gameId}-board`)) as IBoardStore;
  }

  async setNewRoundEvent(gameId: string) {
    const prev = await this.getBoardStore(gameId);

    await this.setBoardStore(gameId, {
      isNewRound: true,
      gameRound: ++prev.gameRound,
      playersTurn: ++prev.playersTurn,
      playerActions: [],
    });
  }

  async setNewTurnEvent(gameId: string) {
    const prev = await this.getBoardStore(gameId);

    await this.setBoardStore(gameId, {
      isNewRound: false,
      gameRound: prev.gameRound,
      playersTurn: ++prev.playersTurn,
      playerActions: [],
    });
  }

  async setNextRound(gameId: string) {
    const prev = await this.getBoardStore(gameId);

    await this.setBoardStore(gameId, {
      ...prev,
      isNewRound: false,
      playersTurn: ++prev.playersTurn,
    });
  }
}

//   // Update field actions on new round
//   setNewRoundEvent.watch((v) => updateFieldActionsEvent());

//   export const boardStore = BoardDomain.store<IBoardStore>({
//     gameRound: 0,
//     isNewRound: false,
//     playersTurn: 0,
//     playerActions: [],
//   })
//     .on(setNewRoundEvent, (prev) => {
//       return {
//         isNewRound: true,
//         gameRound: ++prev.gameRound,
//         playersTurn: ++prev.playersTurn,
//         playerActions: [],
//       };
//     })
//     .on(setNewTurnEvent, (prev) => ({
//       isNewRound: false,
//       gameRound: prev.gameRound,
//       playersTurn: ++prev.playersTurn,
//       playerActions: [],
//     }))
//     .on(setPlayerActionEvent, (prev, playerActions) => ({
//       ...prev,
//       playerActions: [...prev.playerActions, playerActions],
//     }))
//     .on(setNextRound, (prev) => ({
//       ...prev,
//       isNewRound: false,
//       playersTurn: ++prev.playersTurn,
//     }))
//     .reset(resetBoardStoreEvent);
