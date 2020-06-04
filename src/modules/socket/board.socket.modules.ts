import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { UsersService } from '../../api.gateway/users/users.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { BoardSocket } from './board.init';
import { BoardMessage } from '../../socket.messages/income.messages';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: Transport.NATS,
      },
      {
        name: MsNames.fields,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [BoardSocket, BoardMessage, UsersService, FieldsService],
  controllers: [],
})
export class BoardSocketModule {}
