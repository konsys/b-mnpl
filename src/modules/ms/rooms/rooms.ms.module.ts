import { ClientsModule, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { RoomsMsController } from './rooms.ms.controller';

@Module({
  controllers: [RoomsMsController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.ROOMS,
        transport: Transport.NATS,
      },
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class RoomsMsModule {}
