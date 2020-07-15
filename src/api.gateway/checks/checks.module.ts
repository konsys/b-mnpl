import { Module } from '@nestjs/common';
import { ChecksController } from './checks.controller';
import { ChecksService } from './checks.service';
import { UsersService } from '../users/users.service';
import { StoreService } from '../store/store.service';
import { FieldsService } from '../fields/fields.service';
import { UsersModule } from '../users/users.module';
import { ActionModule } from '../action/action.module';

@Module({
  controllers: [ChecksController],
  providers: [ChecksService, UsersService, StoreService, FieldsService],
  imports: [UsersModule, ActionModule],
})
export class ChecksModule {}
