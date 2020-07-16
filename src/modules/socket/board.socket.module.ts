import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionService } from 'src/api.gateway/action/action.service';
import { BoardMessageService } from 'src/api.gateway/action/board.message.service';
import { BoardService } from 'src/api.gateway/action/board.service';
import { BoardSocket } from '../../params/board.init';
import { ChecksService } from 'src/api.gateway/action/checks.service';
import { DicesService } from 'src/api.gateway/action/dices.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { IncomeSocketMessage } from 'src/modules/socket/income.socket.message';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { OutcomeMessageService } from 'src/api.gateway/action/outcome-message.service';
import { StoreService } from 'src/api.gateway/action/store.service';
import { TransactionService } from 'src/api.gateway/action/transaction.service';
import { UsersService } from '../../api.gateway/users/users.service';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: MsNames.USERS,
    //     transport: Transport.NATS,
    //   },
    //   {
    //     name: MsNames.FIELDS,
    //     transport: Transport.NATS,
    //   },
    // ]),
  ],
  providers: [
    // BoardSocket,
    // IncomeSocketMessage,
    // ChecksService,
    // UsersService,
    // FieldsService,
    // BoardMessageService,
    // ActionService,
    // TransactionService,
    // StoreService,
    // OutcomeMessageService,
    // BoardService,
    // DicesService,
  ],
  controllers: [],
})
export class BoardSocketModule {}
