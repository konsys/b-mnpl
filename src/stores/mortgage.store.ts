import { GameDomain } from 'src/stores/actions.store';

const MortgagesDomain = GameDomain.domain('FieldsDomain');
export const resetMortgagesEvent = MortgagesDomain.event();

export interface IMortgagesStore {
  fieldId: number;
  mortgaged: number;
}

export const mortgageFieldEvent = MortgagesDomain.event<IMortgagesStore>();
export const nextTurnMortgageEvent = MortgagesDomain.event<IMortgagesStore[]>();

export const mortgagesStore = MortgagesDomain.store<IMortgagesStore[]>(null)
  .on(mortgageFieldEvent, (prev, data) => {
    const isMortgaged =
      prev && prev.findIndex((v) => v.fieldId === data.fieldId);
    typeof isMortgaged === 'number' &&
      isMortgaged >= 0 &&
      delete prev[isMortgaged];
    return prev ? [...prev, data] : [data];
  })
  .reset(resetMortgagesEvent);

mortgagesStore.watch((v) => console.log('mortgagesStore', v));
