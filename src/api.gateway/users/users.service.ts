import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/ms.types';

@Controller()
export class UsersService {
  private logger: Logger = new Logger('UsersService');
  constructor(
    @Inject(MsNames.users)
    private readonly usersClient: ClientProxy,
  ) {}

  async getAllUsers(filter?: FindManyOptions) {
    try {
      const res = await this.usersClient
        .send<any>({ cmd: MsPatterns.getAllUsers }, filter || { take: 1 })
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }
}
