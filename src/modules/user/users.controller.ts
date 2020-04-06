import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { users } from 'src/entities/dbData';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async get(): Promise<any> {
    return await this.usersService.findOne();
  }

  @Post()
  async save(): Promise<any> {
    return await this.usersService.saveAll(users);
  }
}
