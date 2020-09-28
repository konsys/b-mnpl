import { ClientsModule, Transport } from '@nestjs/microservices';

import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { InventoryMsController } from './inventory.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [InventoryMsController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.INVENTORY,
        transport: Transport.NATS,
      },
    ]),
    TypeOrmModule.forFeature([BoardFieldsEntity]),
  ],
})
export class InventoryMsModule {}
