import { Module } from '@nestjs/common';
import { UsersMsController } from './users.ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersMsService } from './users.ms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientsModule.register([
      { name: 'users', transport: Transport.TCP, options: { port: 3002 } },
    ]),
  ],
  controllers: [UsersMsController],
  providers: [UsersMsService],
})
export class UsersMsModule {}
