import { Module } from '@nestjs/common';
import { FieldsService } from 'src/modules/fields/fields.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { BoardSocket } from './board.socket';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardFieldsEntity]),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [BoardSocket, FieldsService],
  controllers: [],
})
export class BoardSocketModule {}
