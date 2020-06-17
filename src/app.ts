import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from 'src/api.gateway/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FieldsModule } from 'src/api.gateway/fields/fields.module';
import { UsersMsModule } from 'src/modules/ms/users/users.ms.module';
import { FieldsMsModule } from 'src/modules/ms/fields/fields.ms.module';
import { BoardSocketModule } from './modules/socket/board.socket.modules';

const rootPath = join(__dirname, '../../../', 'assets/');
@Module({
  imports: [
    FieldsModule,
    FieldsMsModule,
    UsersModule,
    UsersMsModule,
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
    BoardSocketModule,
  ],
  controllers: [],
  providers: [],
})
export class App {
  constructor(private connection: Connection) {}
}
