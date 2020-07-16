import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionModule } from '../action/action.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { jwtConstants } from 'src/modules/auth/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
    ]),
    // TODO Remove doubling import module with auth module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ActionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [],
})
export class UsersModule {}
