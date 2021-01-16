import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthService } from 'src/modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { jwtConstants } from 'src/config/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MsNames.USERS,
        transport: Transport.NATS,
      },
      {
        name: MsNames.ACTIONS,
        transport: Transport.NATS,
      },
    ]),
    // TODO Remove doubling import module with auth module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
