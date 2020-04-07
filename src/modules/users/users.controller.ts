import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async get(): Promise<any> {
    let res = await this.service.allUsers();
    //  res = await this.client
    //   .send<number>(MsPatterns.getAllUsers, [1, 2, 3, 4, 5])
    //   .toPromise();
    console.log(222222, res);
    return res;
  }
}
