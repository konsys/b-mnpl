import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from '../../api.gateway/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.getUserByCredentials(email, password);
    return user ? user : null;
  }

  async login(user: UsersEntity | any) {
    const payload = {
      username: user.name,
      sub: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
