import { Module } from '@nestjs/common';
import { FieldsMsController } from './fields.ms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { MsNames } from 'src/types/ms.types';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardFieldsEntity]),
    ClientsModule.register([
      {
        name: MsNames.fields,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [],
  controllers: [FieldsMsController],
})
export class FieldsMsModule {}
