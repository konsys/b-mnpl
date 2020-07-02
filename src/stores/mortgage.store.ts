import { GameDomain } from 'src/stores/actions.store';
import { boardStore } from './board.store';

const MortgagesDomain = GameDomain.domain('FieldsDomain');
export const resetMortgagesEvent = MortgagesDomain.event();

export interface IMortgagesStore {
  fieldId: number;
  mortgaged: number;
}

export const mortgageFieldEvent = MortgagesDomain.event<IMortgagesStore>();
export const unMortgageFieldEvent = MortgagesDomain.event<number>();
export const nextTurnMortgageEvent = MortgagesDomain.event();

export const mortgagesStore = MortgagesDomain.store<IMortgagesStore[]>(null)
  .on(mortgageFieldEvent, (prev, data) => {
    const isMortgaged =
      prev && prev.findIndex((v) => v.fieldId === data.fieldId);
    typeof isMortgaged === 'number' &&
      isMortgaged >= 0 &&
      delete prev[isMortgaged];
    return prev ? [...prev, data] : [data];
  })
  .on(unMortgageFieldEvent, (prev, fieldId) => {
    const isMortgaged =
      Array.isArray(prev) && prev.filter((v) => v.fieldId !== fieldId);

    return isMortgaged || prev;
  })
  .on(nextTurnMortgageEvent, (prev, fieldId) => {
    const mortgagedFields =
      prev &&
      prev.map((v, k) => {
        v.mortgaged > 2 ? --v.mortgaged : delete prev[k];
        return { ...v };
      });
    return mortgagedFields || prev;
  })
  .reset(resetMortgagesEvent);

mortgagesStore.watch((v) => console.log('mortgagesStore', v));

boardStore.updates.watch((v) => {
  v.isNewRound && nextTurnMortgageEvent();
});
