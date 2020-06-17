import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/ms.types';
import { fieldsForSave } from 'src/entities/dbData';
@Controller()
export class FieldsService {
  private logger: Logger = new Logger('FieldsService');
  constructor(
    @Inject(MsNames.FIELDS)
    private readonly fieldsClient: ClientProxy,
  ) {}

  async getInitialFields(filter?: FindManyOptions) {
    try {
      const res = await this.fieldsClient
        .send<any>({ cmd: MsPatterns.GET_INIT_FIELDS }, filter || {})
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveFields() {
    try {
      const res = await this.fieldsClient
        .send<any>({ cmd: MsPatterns.SAVE_FIELDS }, fieldsForSave)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
