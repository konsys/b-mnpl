import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardFieldsEntity])],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
