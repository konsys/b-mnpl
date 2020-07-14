import { Module } from '@nestjs/common';
import { BoardMessageService } from './board.message.service';
import { BoardMessageController } from './board.message.controller';
import { UsersService } from '../users/users.service';

@Module({
  providers: [BoardMessageService, UsersService],
  controllers: [BoardMessageController],
})
export class BoardMessageModule {}
