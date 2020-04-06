import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices';
import { MsNames } from 'src/types/ms.types';
import { settings } from 'src/config/settings';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.users,
        transport: settings.useTransport,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
