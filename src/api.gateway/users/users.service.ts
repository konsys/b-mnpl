import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/ms.types';

@Controller()
export class UsersService {
  private logger: Logger = new Logger('UsersService');
  constructor(
    @Inject(MsNames.USERS)
    private readonly usersClient: ClientProxy,
  ) {}

  async getAllUsers(filter?: FindManyOptions) {
    try {
      return await this.usersClient
        .send<any>({ cmd: MsPatterns.GET_ALL_USERS }, filter || { take: 1 })
        .toPromise();
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
