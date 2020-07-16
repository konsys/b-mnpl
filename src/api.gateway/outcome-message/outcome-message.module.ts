import { Module } from '@nestjs/common';
import { OutcomeMessageService } from './outcome-message.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [OutcomeMessageService, UsersService],
  controllers: [],
  exports: [OutcomeMessageService],
})
export class OutcomeMessageModule {}
