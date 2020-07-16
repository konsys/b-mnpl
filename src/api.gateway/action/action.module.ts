import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { DicesService } from './dices.service';
import { StoreService } from './store.service';
import { FieldsService } from '../fields/fields.service';
import { BoardService } from './board.service';

@Module({
  imports: [],
  controllers: [ActionController],
  providers: [
    ActionService,
    DicesService,
    StoreService,
    FieldsService,
    BoardService,
    StoreService,
  ],
  exports: [],
})
export class ActionModule {}
