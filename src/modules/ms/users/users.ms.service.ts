import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsNames, MsPatterns } from 'src/types/ms.types';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class UsersMsService {
  constructor(
    @Inject(MsNames.users)
    private readonly client: ClientProxy,
  ) {}

  async getUsers() {
    const users: UsersEntity[] = await this.client
      .send<any>({ cmd: MsPatterns.getAllUsers }, [1, 2, 3, 4, 5])
      .toPromise();
    console.log(2123123123123, users);
    return users;
  }
}
