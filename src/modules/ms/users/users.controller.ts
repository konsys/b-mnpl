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
import { MessagePattern } from '@nestjs/microservices';
import { UsersPatterns } from 'src/types/ms.types';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @MessagePattern({ cmd: UsersPatterns.getAllUsers })
  async get(): Promise<UsersEntity[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async save(): Promise<UsersEntity[]> {
    return await this.usersService.saveAll(users);
  }
}
