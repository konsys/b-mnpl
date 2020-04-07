import { Module } from '@nestjs/common';
import { BoardSocket } from './board.socket';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { BoardSocketService } from './board.socket.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: Transport.NATS,
      },
    ]),
  ],
  providers: [BoardSocket, BoardSocketService],
  controllers: [],
})
export class BoardSocketModule {}
