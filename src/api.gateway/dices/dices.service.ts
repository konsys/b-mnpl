import { Injectable } from '@nestjs/common';
import { IDicesStore, StoreService } from './store.service';
import { UsersService } from '../users/users.service';
import { FieldsService } from '../fields/fields.service';
import { ActionService } from '../action/action.service';
import { BOARD_PARAMS } from 'src/params/board.params';

@Injectable()
export class DicesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly store: StoreService,
  ) {}

  async setDices(gameId: string, data: IDicesStore) {
    await this.store.setDicesStore(gameId, data);
  }
  async getDices(gameId: string): Promise<IDicesStore> {
    return await this.store.getDicesStore(gameId);
  }

  async randDices(gameId: string, actionId: string): Promise<IDicesStore> {
    const player = await this.usersService.getActingPlayer(gameId);
    const currenPosition = player.meanPosition;

    const dice1 = 1;
    // const dice2 = random(0, 6);
    let dice2 = 1;
    if (player.name === 'Feodr') {
      // dice2 = random(0, 6);
      // dice2 = 5;
    }
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    return {
      userId: player.userId,
      dices: [dice1, dice2, dice3],
      _id: actionId,
      sum: dice1 + dice2 + dice3,
      meanPosition,
      isDouble: dice1 === dice2,
      // isTriple: dice1 === dice2 && dice2 === dice3,
      isTriple: false,
    } as IDicesStore;
  }

  async dicesUpdatePlayerToken(
    gameId: string,
    dices: IDicesStore,
  ): Promise<void> {
    const player = await this.usersService.getActingPlayer(gameId);
    let jailed = 0;
    let movesLeft = 0;
    let meanPosition = dices.meanPosition;
    let doublesRolledAsCombo = player.doublesRolledAsCombo;

    if (player.jailed) {
      if (dices.isDouble) {
        jailed = 0;
        movesLeft = 0;
        doublesRolledAsCombo = 0;
      } else {
        await this.usersService.updatePlayer(gameId, {
          ...player,
          unjailAttempts: ++player.unjailAttempts,
        });
        return;
      }
    } else {
      if (dices.isDouble) {
        doublesRolledAsCombo++;
        movesLeft++;
      } else {
        doublesRolledAsCombo = 0;
      }
    }

    if (doublesRolledAsCombo >= BOARD_PARAMS.JAIL_TURNS) {
      await this.usersService.jailPlayer(gameId);
      return;
    }

    await this.usersService.updatePlayer(gameId, {
      ...player,
      movesLeft,
      doublesRolledAsCombo,
      jailed,
      meanPosition,
    });
  }
}
