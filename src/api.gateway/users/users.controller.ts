import { Controller, Get } from '@nestjs/common';
import { MsPatterns, MsNames } from 'src/types/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { FindManyOptions } from 'typeorm';
import { UsersService } from './users.service';

@Controller(MsNames.users)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async get(): Promise<UsersEntity[]> {
    return await this.service.getAllUsers();
  }
}
