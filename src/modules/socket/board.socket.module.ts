import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionService } from 'src/api.gateway/action/action.service';
import { BoardMessageService } from 'src/api.gateway/action/board.message.service';
import { BoardService } from 'src/api.gateway/action/board.service';
import { BoardSocket } from './board.socket';
import { ChecksService } from 'src/api.gateway/action/checks.service';
import { DicesService } from 'src/api.gateway/action/dices.service';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { FieldsUtilsService } from 'src/api.gateway/action/fields.utils.service';
import { IncomeMessageService } from 'src/api.gateway/action/income-message.service';
import { IncomeSocketMessage } from './income.socket.message';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { OutcomeMessageService } from 'src/api.gateway/action/outcome-message.service';
import { PlayersUtilsService } from 'src/api.gateway/action/players.utils.service';
import { StoreService } from 'src/api.gateway/action/store.service';
import { TransactionsService } from 'src/api.gateway/action/transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [
    BoardSocket,
    IncomeMessageService,
    FieldsService,
    FieldsUtilsService,
    BoardMessageService,
    PlayersUtilsService,
    ChecksService,
    ActionService,
    TransactionsService,
    StoreService,
    OutcomeMessageService,
    BoardService,
    DicesService,
    IncomeSocketMessage,
  ],
  controllers: [],
})
export class BoardSocketModule {}
