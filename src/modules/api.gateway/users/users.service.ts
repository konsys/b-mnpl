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
    try {
      const res = await this.usersClient
        .send<any>({ cmd: MsPatterns.getAllUsers }, filter)
        .toPromise();
      console.log(55555555555, res);
      return res;
    } catch (err) {
      console.log(2422434234, err);
      throw err;
    }
  }
}
