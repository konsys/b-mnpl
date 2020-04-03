import { Module } from '@nestjs/common';
import { FieldService } from 'src/modules/field/field.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/modules/user/users.service';
import { BoardSocket } from './board.socket';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardFieldsEntity]),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [BoardSocket, FieldService, UsersService],
  controllers: [],
})
export class BoardSocketModule {}
