import { Module } from '@nestjs/common';
import { AppGateway } from 'src/socket/AppGateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
