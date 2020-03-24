import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldEntity } from 'src/entities/board.field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardFieldEntity])],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
