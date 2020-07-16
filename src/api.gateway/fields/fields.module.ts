import { Module } from '@nestjs/common';
import { FieldsController } from './fields.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/MS/ms.types';
import { FieldsService } from './fields.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.FIELDS,
        transport: Transport.NATS,
      },
    ]),
    UsersService,
  ],
  providers: [FieldsService],
  controllers: [FieldsController],
  exports: [FieldsService],
})
export class FieldsModule {}
