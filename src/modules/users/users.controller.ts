import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { MessagePattern } from '@nestjs/microservices';
import { UsersPatterns } from 'src/types/ms.types';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  @MessagePattern({ cmd: UsersPatterns.getAllUsers })
  async get(): Promise<UsersEntity[]> {
    return [];
  }
}
