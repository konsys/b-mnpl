import { ClientsModule, Transport } from '@nestjs/microservices';

import { InventoryMsController } from './inventory.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  controllers: [InventoryMsController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.INVENTORY,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class InventoryMsModule {}
