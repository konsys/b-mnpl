import { GameDomain, actionsStore } from 'src/stores/actions.store';
import { getActingPlayer, updatePlayer } from 'src/utils/users.utils';
import { JAIL_TURNS, JAIL_POSITION } from 'src/utils/board.params.util';
import { random } from 'src/lib/utils';

export interface IDicesStore {
  userId: number;
  _id: string;
  dices: number[];
  sum: number;
  meanPosition: number;
  isDouble: boolean;
  isTriple: boolean;
}
const DicesDomain = GameDomain.domain('DicesDomain');
export const resetDicesEvent = DicesDomain.event();

export const setRandomDicesEvent = DicesDomain.event<string>();

export const dicesStore = DicesDomain.store<IDicesStore>(null)
  .on(setRandomDicesEvent, (_, actionId) => {
    const player = getActingPlayer();
    const currenPosition = player.meanPosition;

    const dice1 = 2;
    // const dice2 = random(0, 6);
    let dice2 = 1;
    if (player.userId === 3) {
      dice2 = random(0, 6);
    }
    const dice3 = 0;
    const sum = dice1 + dice2 + dice3 + currenPosition;
    const meanPosition = sum < 40 ? sum : sum - 40;

    const t = {
      userId: player.userId,
      dices: [dice1, dice2, dice3],
      _id: actionId,
      sum,
      meanPosition,
      isDouble: dice1 === dice2,
      // isTriple: dice1 === dice2 && dice2 === dice3,
      isTriple: false,
    };
    return t;
  })
  .reset(resetDicesEvent);

dicesStore.updates.watch(v => {
  if (v) {
    // Jail checks
    const player = getActingPlayer();

    let jailed = 0;
    let movesLeft = 0;
    let meanPosition = v.meanPosition;
    let prevPosition = player.meanPosition;
    let doublesRolledAsCombo = player.doublesRolledAsCombo;
    let unjailAttempts = player.unjailAttempts;

    player.prevPosition = meanPosition;
    if (v.isDouble) {
      doublesRolledAsCombo++;
      movesLeft++;
    }

    if (player.jailed && v.isDouble) {
      jailed = 0;
      movesLeft = 0;
      doublesRolledAsCombo = 0;
    }

    if (doublesRolledAsCombo > JAIL_TURNS) {
      jailed = JAIL_TURNS;
      unjailAttempts = JAIL_TURNS;
      doublesRolledAsCombo = 0;
      movesLeft = 0;
      meanPosition = JAIL_POSITION + 1;
    }

    updatePlayer({
      ...player,
      movesLeft,
      doublesRolledAsCombo,
      jailed,
      unjailAttempts,
      meanPosition,
      prevPosition,
    });
  }
});
