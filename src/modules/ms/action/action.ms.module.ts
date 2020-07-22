import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionMsController } from './action.ms.controller';
import { ActionService } from './action.service';
import { BoardMessageService } from './board.message.service';
import { BoardService } from './board.service';
import { BoardSocket } from 'src/modules/socket/board.socket';
import { ChecksService } from './checks.service';
import { DicesService } from './dices.service';
import { FieldsUtilsService } from './fields.utils.service';
import { IncomeMessageService } from './income-message.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { OutcomeMessageService } from './outcome-message.service';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.ACTIONS,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [ActionMsController],
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
  ],
  exports: [ActionService],
})
export class ActionMsModule {}
