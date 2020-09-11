import { ClientsModule, Transport } from '@nestjs/microservices';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';
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
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
