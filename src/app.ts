import { ActionModule } from './modules/ms/action/action.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardSocketModule } from './modules/socket/board.socket.module';
import { Connection } from 'typeorm';
import { FieldsModule } from './api.gateway/fields/fields.module';
import { FieldsMsModule } from './modules/ms/fields/fields.ms.module';
import { GameModule } from './api.gateway/game/game.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api.gateway/users/users.module';
import { UsersMsModule } from './modules/ms/users/users.ms.module';
import { join } from 'path';
const rootPath = join(__dirname, '../', 'assets/');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '0.0.0.0',
      port: 3306,
      username: 'game',
      password: 'game',
      database: 'mnpl',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: ['error'],
    }),

    ActionModule,
    AuthModule,
    BoardSocketModule,
    GameModule,
    FieldsModule,
    FieldsMsModule,
    UsersModule,
    UsersMsModule,
  ],
  controllers: [],
  providers: [],
})
export class App {
  constructor(private connection: Connection) {}
}
