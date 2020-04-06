import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardFieldsEntity])],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}
