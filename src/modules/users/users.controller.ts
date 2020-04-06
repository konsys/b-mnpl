import { Controller, Get, Inject } from '@nestjs/common';
import { MsNames } from 'src/types/ms.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MsNames.users)
    private readonly service: UsersService,
  ) {}

  @Get()
  async get(): Promise<any> {
    const res = await this.service.getUsers();
    console.log(222222, res);
    return res;
  }
}
