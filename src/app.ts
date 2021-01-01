import { ActionMsModule } from './modules/ms/action/action.ms.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './api.gateway/board/board.module';
import { ChatModule } from './api.gateway/game.chat/chat.module';
import { ChatMsModule } from './modules/ms/chat/chat.ms.module';
import { Connection } from 'typeorm';
import { FieldsModule } from './api.gateway/fields/fields.module';
import { FieldsMsModule } from './modules/ms/fields/fields.ms.module';
import { InventoryModule } from './api.gateway/inventory/inventory.module';
import { InventoryMsModule } from './modules/ms/inventory/inventory.ms.module';
import { Module } from '@nestjs/common';
import { RoomsModule } from './api.gateway/rooms/rooms.module';
import { RoomsMsModule } from './modules/ms/rooms/rooms.ms.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketModule } from './modules/socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api.gateway/users/users.module';
import { UsersMsModule } from './modules/ms/users/users.ms.module';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
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
      // logging: ['error'],
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'CatsPets88@yandex.ru',
          pass: 'detczeknyhsmhkty',
        },
      },
    }),
    ActionMsModule,
    AuthModule,
    SocketModule,
    BoardModule,
    FieldsModule,
    RoomsModule,
    RoomsMsModule,
    FieldsMsModule,
    UsersModule,
    UsersMsModule,
    ChatModule,
    ChatMsModule,
    InventoryModule,
    InventoryMsModule,
  ],
  controllers: [],
  providers: [],
})
export class App {
  constructor(private connection: Connection) {}
}
