import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { MsPatterns, MsNames } from 'src/types/ms.types';

@Controller()
export class BoardSocketService {
  constructor(
    @Inject(MsNames.users)
    private readonly usersClient: ClientProxy,
  ) {}

  @MessagePattern({ cmd: MsPatterns.getAllUsers })
  async allUsers(filter?: FindManyOptions) {
    console.log(11111111111, filter);
    const users: UsersEntity[] = await this.usersClient
      .send<any>({ cmd: MsPatterns.getAllUsers }, filter)
      .toPromise();
    return users;
  }
}
