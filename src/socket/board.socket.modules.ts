import { Module } from '@nestjs/common';
import { BoardSocket } from './board.socket';
import { FieldService } from 'src/field/field.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardFieldsEntity])],
  providers: [BoardSocket, FieldService],
  controllers: [],
})
export class BoardSocketModule {}
