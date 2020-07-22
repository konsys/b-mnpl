import { Injectable, Inject } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import { IncomeMessageType, IFieldId } from 'src/types/Board/board.types';

@Injectable()
export class GameService {
  constructor(
    @Inject(MsNames.ACTIONS)
    private readonly proxy: ClientProxy,
  ) {}

  async dicesModal(): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async fieldBought(): Promise<void> {
    const res = await this.proxy
      .send<any>({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED }, undefined)
      .toPromise();
    return res;
  }

  async fieldAuction(): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async acceptAuction(): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async declineAuction(): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async payment(): Promise<void> {
    const res = await this.proxy
      .send<any>({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED }, undefined)
      .toPromise();
    return res;
  }

  async unJailPayment(): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async mortgageField(payload: IFieldId): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async unMortgageField(payload: IFieldId): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED },
        undefined,
      )
      .toPromise();
    return res;
  }

  async levelUpField(payload: IFieldId): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async levelDownField(payload: IFieldId): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }
}
