import { GameDomain } from 'src/stores/actions.store';
import {
  getActingPlayer,
  updatePlayer,
  jailPlayer,
} from 'src/utils/users.utils';
import { BOARD_PARAMS } from 'src/params/board.params';
import { redis } from 'src/main';
// import { random } from 'src/utils/common.utils';

export interface IDicesStore {
  userId: number;
  _id: string;
  dices: number[];
  sum: number;
  meanPosition: number;
  isDouble: boolean;
  isTriple: boolean;
}

export const setDices = async (gameId: string, t: IDicesStore) =>
  await redis.set(`${gameId}-dices`, JSON.stringify(t));

export const getDices = async (gameId: string): Promise<IDicesStore> =>
  JSON.parse(await redis.get(`${gameId}-dices`)) as IDicesStore;

const randDices = async (actionId: string) => {
  const player = await getActingPlayer('kkk');
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
  };
};

const DicesDomain = GameDomain.domain('DicesDomain');
export const resetDicesEvent = DicesDomain.event();

export const setRandomDicesEvent = DicesDomain.event<string>();

export const dicesStore = DicesDomain.store<IDicesStore>(null)
  .on(setRandomDicesEvent, (_, actionId) => {
    randDices(actionId);
  })
  .reset(resetDicesEvent);

export const dicesUpdatePlayerToken = async (
  dices: IDicesStore,
): Promise<void> => {
  const player = await getActingPlayer('kkk');
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
      updatePlayer('kkk', {
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
    jailPlayer('kkk');
    return;
  }

  await updatePlayer('kkk', {
    ...player,
    movesLeft,
    doublesRolledAsCombo,
    jailed,
    meanPosition,
  });
};
