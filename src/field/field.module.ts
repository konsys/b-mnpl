import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldEntity } from 'src/entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldEntity])],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
