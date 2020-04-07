import { Module } from '@nestjs/common';
import { UsersMsController } from './users.ms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientsModule.register([
      {
        name: 'users',
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [UsersMsController],
  providers: [],
})
export class UsersMsModule {}
