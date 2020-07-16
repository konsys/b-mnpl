import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { BoardService } from './board.service';
import { DicesService } from './dices.service';
import { FieldsUtilsService } from './fields.utils.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionService } from './transaction.service';

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
    BoardService,
    StoreService,
    TransactionService,
    PlayersUtilsService,
    FieldsUtilsService,
  ],
  exports: [ActionService],
})
export class ActionModule {}
