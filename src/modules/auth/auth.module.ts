import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../../api.gateway/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
