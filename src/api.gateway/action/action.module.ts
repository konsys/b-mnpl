import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { BoardService } from './board.service';
import { DicesService } from './dices.service';
import { FieldsService } from '../fields/fields.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { StoreService } from './store.service';
import { TransactionService } from './transaction.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [ActionController],
  providers: [
    ActionService,
    DicesService,
    StoreService,
    FieldsService,
    BoardService,
    StoreService,
    UsersService,
    TransactionService,
  ],
  exports: [ActionService],
})
export class ActionModule {}
