import { Module } from '@nestjs/common';
import { UsersMsController } from './users.ms.controller';
import { UsersMsService } from './users.ms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { ClientsModule } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { settings } from 'src/config/settings';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: settings.useTransport,
      },
    ]),
  ],
  controllers: [UsersMsController],
  providers: [UsersMsService],
})
export class UsersMsModule {}
