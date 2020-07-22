import { ClientsModule, Transport } from '@nestjs/microservices';

import { GameController } from './game.controller';
import { GameService } from './game.service';
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
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
