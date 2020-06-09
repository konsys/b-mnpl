import { GameDomain } from 'src/stores/actions.store';
import { getActingPlayer, updatePlayer, goToJail } from 'src/utils/users.utils';
import { JAIL_TURNS, JAIL_POSITION } from 'src/utils/board.params.utils';
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
const DicesDomain = GameDomain.domain('DicesDomain');
export const resetDicesEvent = DicesDomain.event();

export const setRandomDicesEvent = DicesDomain.event<string>();

export const dicesStore = DicesDomain.store<IDicesStore>(null)
  .on(setRandomDicesEvent, (_, actionId) => {
    const player = getActingPlayer();
    const currenPosition = player.meanPosition;

    const dice1 = 2;
    // const dice2 = random(0, 6);
    let dice2 = 4;
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
  })
  .reset(resetDicesEvent);

export const dicesUpdatePlayerToken = (v: IDicesStore) => {
  if (v) {
    // Jail checks
    const player = getActingPlayer();

    let jailed = 0;
    let movesLeft = 0;
    let meanPosition = v.meanPosition;
    let doublesRolledAsCombo = player.doublesRolledAsCombo;
    let unjailAttempts = player.unjailAttempts;

    if (v.isDouble) {
      doublesRolledAsCombo++;
      movesLeft++;
    } else {
      doublesRolledAsCombo = 0;
    }

    if (player.jailed && v.isDouble) {
      jailed = 0;
      movesLeft = 0;
      doublesRolledAsCombo = 0;
      unjailAttempts = 0;
    } else if (player.jailed && !v.isDouble) {
      unjailAttempts++;
      // meanPosition = JAIL_POSITION;
    }

    if (doublesRolledAsCombo > JAIL_TURNS) {
      goToJail();
      return;
    }

    updatePlayer({
      ...player,
      movesLeft,
      doublesRolledAsCombo,
      jailed,
      unjailAttempts,
      meanPosition,
    });
  }
};
