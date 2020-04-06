import { Module } from '@nestjs/common';
import { UsersMsController } from './users.ms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { Connection } from 'typeorm';
import { UsersMsService } from './users.ms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
  ],

  controllers: [UsersMsController],
  providers: [UsersMsService],
})
export class UsersMsModule {
  constructor(private connection: Connection) {}
}
