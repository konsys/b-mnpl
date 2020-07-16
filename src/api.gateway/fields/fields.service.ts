import { Inject, Injectable, Logger } from '@nestjs/common';
import { MsNames, MsPatterns } from 'src/types/MS/ms.types';

import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import _ from 'lodash';
import { fieldsForSave } from 'src/entities/dbData';

@Injectable()
export class FieldsService {
  private logger: Logger = new Logger('FieldsService');
  constructor(
    @Inject(MsNames.FIELDS)
    private readonly proxy: ClientProxy,
  ) {}

  async getInitialFields(filter?: FindManyOptions) {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsPatterns.GET_INIT_FIELDS }, filter || {})
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveFields() {
    try {
      const fields = fieldsForSave();

      const res = await this.proxy
        .send<any>({ cmd: MsPatterns.SAVE_FIELDS }, fields)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
