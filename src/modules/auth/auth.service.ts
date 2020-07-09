import { Injectable } from '@nestjs/common';
import { UsersService } from '../../api.gateway/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(username);
    const user = await this.usersService.getUserByCredentials(
      username,
      password,
    );
    return user ? user : null;
  }
}
