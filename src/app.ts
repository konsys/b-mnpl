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
import { AuthModule } from './modules/auth/auth.module';
import { BoardMessageModule } from './api.gateway/board.message/board.message.module';
import { ChecksModule } from './api.gateway/checks/checks.module';
import { TransactionModule } from './api.gateway/transaction/transaction.module';
import { BoardModule } from './api.gateway/board/board.module';
import { IncomeMessageModule } from './api.gateway/income-message/income-message.module';
import { OutcomeMessageModule } from './api.gateway/outcome-message/outcome-message.module';
import { StoreModule } from './api.gateway/store/store.module';
import { DicesModule } from './api.gateway/dices/dices.module';

const rootPath = join(__dirname, '../', 'assets/');

@Module({
  imports: [
    FieldsModule,
    FieldsMsModule,
    StoreModule,
    DicesModule,
    UsersModule,
    UsersMsModule,
    BoardModule,
    AuthModule,
    ChecksModule,
    BoardMessageModule,
    TransactionModule,
    IncomeMessageModule,
    OutcomeMessageModule,
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
