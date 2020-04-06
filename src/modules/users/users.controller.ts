import { Controller, Get, Inject } from '@nestjs/common';
import { MsNames, MsPatterns } from 'src/types/ms.types';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(@Inject(MsNames.users) private readonly client: ClientProxy) {}

  @Get()
  async get(): Promise<any> {
    const res = await this.client.send<number>(MsPatterns.getAllUsers, [
      1,
      2,
      3,
      4,
      5,
    ]);
    console.log(222222, res);
    return res;
  }
}
