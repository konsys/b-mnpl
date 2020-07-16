import {
  IField,
  IFieldAction,
  IMoneyTransaction,
  IPlayer,
} from 'src/types/Board/board.types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { MsNames, MsPatterns } from 'src/types/MS/ms.types';

import { ActionService } from '../action/action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { ChecksService } from 'src/api.gateway/action/checks.service';
import { ClientProxy } from '@nestjs/microservices';
import { FieldType } from 'src/entities/board.fields.entity';
import { FindManyOptions } from 'typeorm';
import { StoreService } from '../action/store.service';
import { TransactionService } from '../action/transaction.service';
import { UsersService } from '../users/users.service';
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
