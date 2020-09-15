import { ClientsModule, Transport } from '@nestjs/microservices';

import { BoardController } from './board.controller';
import { BoardService } from './board.service';
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
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
