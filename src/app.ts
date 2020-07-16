import { ActionModule } from './api.gateway/action/action.module';
import { BoardSocketModule } from './modules/socket/board.socket.module';
import { Connection } from 'typeorm';
import { FieldsModule } from './api.gateway/fields/fields.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api.gateway/users/users.module';
import { join } from 'path';
const rootPath = join(__dirname, '../', 'assets/');

@Module({
  imports: [
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
    ServeStaticModule.forRoot({
      rootPath,
    }),
    ActionModule,
  ],
  controllers: [],
  providers: [],
})
export class App {
  constructor(private connection: Connection) {}
}
