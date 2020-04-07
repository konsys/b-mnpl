import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/ms.types';

@Controller()
export class FieldsService {
  private logger: Logger = new Logger('FieldsService');
  constructor(
    @Inject(MsNames.fields)
    private readonly fieldsClient: ClientProxy,
  ) {}

  async getInitialFields(filter?: FindManyOptions) {
    try {
      const res = await this.fieldsClient
        .send<any>({ cmd: MsPatterns.getInitFields }, filter || {})
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
