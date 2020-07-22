import { ClientsModule, Transport } from '@nestjs/microservices';

import { ActionModule } from '../../modules/ms/action/action.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { PlayersUtilsService } from '../../modules/ms/action/players.utils.service';
import { StoreService } from '../../modules/ms/action/store.service';
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
      signOptions: { expiresIn: jwtConstants.expires },
    }),
    ActionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, PlayersUtilsService, StoreService],
  exports: [UsersService],
})
export class UsersModule {}
