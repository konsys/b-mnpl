import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { DicesService } from '../dices/dices.service';
import { StoreService } from '../store/store.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, DicesService, StoreService],
  exports: [],
})
export class ActionModule {}
