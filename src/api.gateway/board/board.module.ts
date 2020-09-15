import { ClientsModule, Transport } from '@nestjs/microservices';

import { BoardController } from './board.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.ACTIONS,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [],
  exports: [],
})
export class BoardModule {}
