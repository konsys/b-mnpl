import { Module } from '@nestjs/common';
import { OutcomeMessageService } from '../action/outcome-message.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { FieldsService } from '../fields/fields.service';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class OutcomeMessageModule {}
