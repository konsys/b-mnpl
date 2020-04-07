import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @Inject('users')
    private readonly client: ClientProxy,
  ) {}

  async allUsers() {
    const users: any = await this.client
      .send<any>({ cmd: 'ping' }, { test: 'test' })
      .toPromise();
    return users;
  }
}
