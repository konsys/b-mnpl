import { Controller, Get } from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';

@Controller('users')
export class UsersController {
  @Get()
  async get(): Promise<UsersEntity[]> {
    return [];
  }
}
