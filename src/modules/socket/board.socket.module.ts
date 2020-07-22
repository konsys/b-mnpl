import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionService } from 'src/modules/ms/action/action.service';
import { BoardMessageService } from 'src/modules/ms/action/board.message.service';
import { BoardService } from 'src/modules/ms/action/board.service';
import { BoardSocket } from './board.socket';
import { ChecksService } from 'src/modules/ms/action/checks.service';
import { DicesService } from 'src/modules/ms/action/dices.service';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { FieldsUtilsService } from 'src/modules/ms/action/fields.utils.service';
import { IncomeMessageService } from 'src/modules/ms/action/income-message.service';
// import { IncomeSocketMessage } from './income.socket.message';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { OutcomeMessageService } from 'src/modules/ms/action/outcome-message.service';
import { PlayersUtilsService } from 'src/modules/ms/action/players.utils.service';
import { StoreService } from 'src/modules/ms/action/store.service';
import { TransactionsService } from 'src/modules/ms/action/transactions.service';

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
    // IncomeSocketMessage,
  ],
  controllers: [],
})
export class BoardSocketModule {}
