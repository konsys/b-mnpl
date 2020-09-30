import { ClientsModule, Transport } from '@nestjs/microservices';

import { InventoryEntity } from 'src/entities/invenory.entity';
import { InventoryMsController } from './inventory.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [InventoryMsController],
  imports: [
    TypeOrmModule.forFeature([InventoryEntity]),
    ClientsModule.register([
      {
        name: MsNames.INVENTORY,
        transport: Transport.NATS,
      },
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
