import { ClientsModule, Transport } from '@nestjs/microservices';

import { InventoryMsController } from './inventory.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  controllers: [InventoryMsController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class InventoryMsModule {}
