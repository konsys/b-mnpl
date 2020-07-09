import { Injectable } from '@nestjs/common';
import { UsersService } from '../../api.gateway/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByCredentials(name, pass);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
