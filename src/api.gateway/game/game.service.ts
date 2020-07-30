import { Injectable, Inject } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import {
  IncomeMessageType,
  IPayload,
  IContract,
} from 'src/types/board/board.types';

@Injectable()
export class GameService {
  constructor(
    @Inject(MsNames.ACTIONS)
    private readonly proxy: ClientProxy,
  ) {}

  async dicesModalClicked(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>({ cmd: IncomeMessageType.INCOME_ROLL_DICES_CLICKED }, payload)
      .toPromise();

    return res;
  }

  async fieldBought(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>({ cmd: IncomeMessageType.INCOME_BUY_FIELD_CLICKED }, payload)
      .toPromise();
    return res;
  }

  async fieldAuction(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_START_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async acceptAuction(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_ACCEPT_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async declineAuction(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_AUCTION_DECLINE_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async payment(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>({ cmd: IncomeMessageType.INCOME_TAX_PAID_CLICKED }, undefined)
      .toPromise();
    return res;
  }

  async unJailPayment(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_UN_JAIL_PAID_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async mortgageField(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_MORTGAGE_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async unMortgageField(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_UN_MORTGAGE_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async levelUpField(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_LEVEL_UP_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async levelDownField(payload: IPayload): Promise<void> {
    const res = await this.proxy
      .send<any>(
        { cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED },
        payload,
      )
      .toPromise();
    return res;
  }

  async contractStart(payload: IContract): Promise<void> {
    // const res = await this.proxy
    //   .send<any>(
    //     { cmd: IncomeMessageType.INCOME_LEVEL_DOWN_FIELD_CLICKED },
    //     payload,
    //   )
    //   .toPromise();
    // return res;
    console.log(payload);
  }
}
