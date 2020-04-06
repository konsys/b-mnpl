import { Module } from '@nestjs/common';
import { UsersMsController } from './users.ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'users', transport: Transport.TCP, options: { port: 3002 } },
    ]),
  ],

  controllers: [UsersMsController],
  providers: [],
})
export class UsersMsModule {}
