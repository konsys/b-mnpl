import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { UsersService } from './users.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}