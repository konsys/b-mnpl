import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionModule } from '../../modules/ms/action/action.module';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
    ActionModule,
  ],
  providers: [FieldsService],
  controllers: [FieldsController],
  exports: [FieldsService],
})
export class FieldsModule {}
