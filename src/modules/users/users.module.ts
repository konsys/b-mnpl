import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'users',
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
