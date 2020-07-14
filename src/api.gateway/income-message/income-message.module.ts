import { Module } from '@nestjs/common';
import { IncomeMessageService } from './income-message.service';

@Module({
  providers: [IncomeMessageService]
})
export class IncomeMessageModule {}
