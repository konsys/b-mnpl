import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionModule } from '../action/action.module';
import { ActionService } from '../action/action.service';
import { ChecksService } from '../action/checks.service';
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
  providers: [FieldsService, ActionService, ChecksService],
  controllers: [FieldsController],
  exports: [FieldsService],
})
export class FieldsModule {}
