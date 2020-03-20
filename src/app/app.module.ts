import { Module } from '@nestjs/common';
import { AppGateway } from 'src/socket/AppGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.17.0.2',
      port: 3306,
      username: 'game',
      password: 'game',
      database: 'mnpl',
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
