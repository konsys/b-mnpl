import { Module } from '@nestjs/common';
import { BoardMessageService } from './board.message.service';
import { BoardMessageController } from './board.message.controller';
import { UsersService } from '../users/users.service';
import { OutcomeMessageService } from '../outcome-message/outcome-message.service';

@Module({
  providers: [BoardMessageService, UsersService],
  controllers: [BoardMessageController],
})
export class BoardMessageModule {
  imports: [OutcomeMessageService];
  providers: [OutcomeMessageService];
}
