import { ClientsModule, Transport } from '@nestjs/microservices';

import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';

@Module({
  controllers: [ChatController],
  imports: [
    ClientsModule.register([
      {
        name: MsNames.CHAT,
        transport: Transport.NATS,
      },
    ]),
  ],
})
export class ChatModule {}
