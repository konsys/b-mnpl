import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { UsersService } from '../../api.gateway/users/users.service';
import { FieldsService } from '../../api.gateway/fields/fields.service';
import { BoardSocketInit } from './board.init';
import { BoardMessage } from '../../actions/handle.message';

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
  providers: [BoardSocketInit, BoardMessage, UsersService, FieldsService],
  controllers: [],
})
export class BoardSocketModule {}
