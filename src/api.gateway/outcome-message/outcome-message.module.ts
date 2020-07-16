import { Module } from '@nestjs/common';
import { OutcomeMessageService } from './outcome-message.service';

@Module({
  imports: [],
  providers: [OutcomeMessageService],
  controllers: [],
  exports: [OutcomeMessageService],
})
export class OutcomeMessageModule {}
