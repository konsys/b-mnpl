import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersService } from '../../api.gateway/users/users.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { BoardSocket } from '../../params/board.init';
import { IncomeSocketMessage } from 'src/modules/socket/income.socket.message';
import { BoardMessageService } from 'src/api.gateway/board.message/board.message.service';
import { ActionService } from 'src/api.gateway/action/action.service';
import { ChecksService } from 'src/api.gateway/checks/checks.service';
import { TransactionService } from 'src/api.gateway/transaction/transaction.service';
import { StoreService } from 'src/api.gateway/store/store.service';
import { OutcomeMessageService } from 'src/api.gateway/outcome-message/outcome-message.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
    OutcomeMessageService,
  ],
  providers: [
    BoardSocket,
    IncomeSocketMessage,
    ChecksService,
    UsersService,
    FieldsService,
    BoardMessageService,
    ActionService,
    TransactionService,
    StoreService,
  ],
  controllers: [],
})
export class BoardSocketModule {}
