import { Module } from '@nestjs/common';
import { OutcomeMessageService } from './outcome-message.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { FieldsService } from '../fields/fields.service';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [UsersModule, FieldsModule],
  providers: [OutcomeMessageService, UsersService, FieldsService],
  controllers: [],
  exports: [OutcomeMessageService],
})
export class OutcomeMessageModule {}
