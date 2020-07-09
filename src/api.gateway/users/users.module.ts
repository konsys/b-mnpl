import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersService } from './users.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
