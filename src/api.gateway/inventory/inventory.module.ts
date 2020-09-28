import { ClientsModule, Transport } from '@nestjs/microservices';

import { InventoryController } from './inventory.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  controllers: [InventoryController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.INVENTORY,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class InventoryModule {}
