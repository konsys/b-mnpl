import { GameDomain } from 'src/stores/actions.store';
import { getActingPlayer, updatePlayer } from 'src/utils/users.utils';
import { JAIL_TURNS, JAIL_POSITION } from 'src/utils/board.params.util';

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

export const setDicesEvent = DicesDomain.event<IDicesStore | null>();

export const dicesStore = DicesDomain.store<IDicesStore>(null)
  .on(setDicesEvent, (_, data) => data)
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
      doublesRolledAsCombo = 0;
      movesLeft = 0;
      prevPosition = JAIL_POSITION;
    }

    updatePlayer({
      ...player,
      movesLeft,
      doublesRolledAsCombo,
      jailed,
      meanPosition,
      prevPosition,
    });
  }
});
