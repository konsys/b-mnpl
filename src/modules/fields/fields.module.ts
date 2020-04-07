import { Module } from '@nestjs/common';
import { FieldsController } from './fields.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.fields,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [],
  controllers: [FieldsController],
})
export class FieldsModule {}
