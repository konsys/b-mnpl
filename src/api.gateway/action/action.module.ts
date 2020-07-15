import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { DicesService } from './dices.service';
import { StoreService } from './store.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, DicesService, StoreService],
  exports: [ActionService, DicesService, StoreService],
})
export class ActionModule {}
