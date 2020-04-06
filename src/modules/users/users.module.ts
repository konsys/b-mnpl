import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { ClientsModule } from '@nestjs/microservices';
import { MicroservicesNames } from 'src/types/ms.types';
import { settings } from '../../config/settings';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientsModule.register([
      {
        name: MicroservicesNames.users,
        transport: settings.useTransport,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
