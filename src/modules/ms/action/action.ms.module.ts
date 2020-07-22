import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionController } from './action.ms.controller';
import { ActionService } from './action.service';
import { BoardMessageService } from './board.message.service';
import { BoardService } from './board.service';
import { BoardSocket } from 'src/modules/socket/board.socket';
import { ChecksService } from './checks.service';
import { DicesService } from './dices.service';
import { FieldsService } from '../../../api.gateway/fields/fields.service';
import { FieldsUtilsService } from './fields.utils.service';
import { IncomeMessageService } from './income-message.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { OutcomeMessageService } from './outcome-message.service';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';

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
    ChecksService,
    StoreService,
    BoardService,
    BoardMessageService,
    StoreService,
    TransactionsService,
    PlayersUtilsService,
    FieldsUtilsService,
    IncomeMessageService,
    BoardSocket,
    OutcomeMessageService,
    FieldsService,
  ],
  exports: [ActionService],
})
export class ActionModule {}
