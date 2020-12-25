import { ClientsModule, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersMsController } from './users.ms.controller';
import { TokensEntity } from 'src/entities/tokens.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, TokensEntity]),
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
    ]),
  ],
  controllers: [UsersMsController],
  providers: [],
})
export class UsersMsModule {}
