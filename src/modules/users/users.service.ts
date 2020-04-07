import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsPatterns } from 'src/types/ms.types';

@Injectable()
export class UsersService {
  constructor(
    @Inject('users')
    private readonly client: ClientProxy,
  ) {}

  async allUsers() {
    const users: any = await this.client
      .send<any>({ cmd: MsPatterns.getAllUsers }, { test: 'test' })
      .toPromise();
    return users;
  }
}
