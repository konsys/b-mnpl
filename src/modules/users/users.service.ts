import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsNames, MsPatterns } from 'src/types/ms.types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MsNames.users)
    private readonly client: ClientProxy,
  ) {}

  async getUsers() {
    const image: any = await this.client
      .send<any>({ cmd: MsPatterns.getAllUsers }, {})
      .toPromise();
    return image;
  }
}
