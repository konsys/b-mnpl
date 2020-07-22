import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionMsModule } from '../../modules/ms/action/action.ms.module';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),

    ActionMsModule,
  ],
  providers: [FieldsService],
  controllers: [FieldsController],
  exports: [FieldsService],
})
export class FieldsModule {}
