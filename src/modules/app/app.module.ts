import { Module } from '@nestjs/common';
import { BoardSocket } from 'src/modules/socket/board.socket';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { FieldModule } from 'src/modules/field/field.module';
import { UsersModule } from 'src/modules/user/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BoardSocketModule } from 'src/modules/socket/board.socket.modules';

const rootPath = join(__dirname, '../../../', 'assets/');
@Module({
  imports: [
    FieldModule,
    UsersModule,
    BoardSocketModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.17.0.2',
      port: 3306,
      username: 'game',
      password: 'game',
      database: 'mnpl',
      entities: [__dirname + '/../../entities/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: ['query'],
    }),
    ServeStaticModule.forRoot({
      rootPath,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
