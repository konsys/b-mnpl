import { Module } from '@nestjs/common';
import { BoardSocket } from './board.socket';
import { FieldService } from 'src/field/field.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/user/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardFieldsEntity]),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [BoardSocket, FieldService, UsersService],
  controllers: [],
})
export class BoardSocketModule {}
