import { ClientsModule, Transport } from '@nestjs/microservices';

import { ChatMsController } from './chat.ms.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.CHAT,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [ChatMsController],
})
export class ChatMsModule {}
