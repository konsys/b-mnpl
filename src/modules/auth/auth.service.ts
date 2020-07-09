import { Injectable } from '@nestjs/common';
import { UsersService } from '../../api.gateway/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByCredentials(email, password);
    return user ? user : null;
  }

  async login(user: UsersEntity) {
    console.log(user);
    const payload = {
      name: user.name,
      id: user.userId,
      vip: user.vip,
      sub: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
