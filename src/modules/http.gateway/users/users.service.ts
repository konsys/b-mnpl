import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/ms.types';

@Controller()
export class UsersService {
  constructor(
    @Inject(MsNames.users)
    private readonly usersClient: ClientProxy,
  ) {}

  async getAllUsers(filter?: FindManyOptions) {
    return await this.usersClient
      .send<any>({ cmd: MsPatterns.getAllUsers }, filter)
      .toPromise();
  }
}
