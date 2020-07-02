import { Module } from '@nestjs/common';
import { FieldsController } from './fields.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/MS/ms.types';
import { FieldsService } from './fields.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}
