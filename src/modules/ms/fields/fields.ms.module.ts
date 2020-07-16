import { ClientsModule, Transport } from '@nestjs/microservices';

import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { FieldsMsController } from './fields.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardFieldsEntity]),
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [],
  controllers: [FieldsMsController],
})
export class FieldsMsModule {}
