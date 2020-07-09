import { Injectable } from '@nestjs/common';
import { UsersService } from '../../api.gateway/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByCredentials(email, password);
    return user ? user : null;
  }
}
