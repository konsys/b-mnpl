import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsPatterns, MsNames } from 'src/types/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { FindManyOptions } from 'typeorm';
@Controller('users')
export class UsersController {
  constructor(
    @Inject(MsNames.users)
    private readonly client: ClientProxy,
  ) {}

  @Get()
  async get(): Promise<UsersEntity[]> {
    const filter: FindManyOptions = { take: 2 };
    return await this.client
      .send<any>({ cmd: MsPatterns.getAllUsers }, filter)
      .toPromise();
  }
}
