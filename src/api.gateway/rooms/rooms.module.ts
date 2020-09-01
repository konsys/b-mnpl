import { ClientsModule, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { RoomsController } from './rooms.controller';

@Module({
  controllers: [RoomsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.ROOMS,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class RoomsModule {}
