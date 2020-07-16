import { Module } from '@nestjs/common';
import { StoreService } from './store.service';

@Module({
  imports: [],
  providers: [StoreService],
  controllers: [],
  exports: [StoreService],
})
export class StoreModule {}
