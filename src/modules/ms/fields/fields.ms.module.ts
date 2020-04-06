import { Module } from '@nestjs/common';
import { FieldsMsService } from './fields.ms.service';
import { FieldsMsController } from './fields.ms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardFieldsEntity])],
  providers: [FieldsMsService],
  controllers: [FieldsMsController],
})
export class FieldsMsModule {}
