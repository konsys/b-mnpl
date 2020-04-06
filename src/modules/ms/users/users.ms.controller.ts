import {
  Controller,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersMsService } from './users.ms.service';
import { MessagePattern } from '@nestjs/microservices';
import { MsPatterns } from 'src/types/ms.types';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UsersMsController {
  constructor(private usersService: UsersMsService) {}

  @MessagePattern({ cmd: MsPatterns.getAllUsers })
  async get(): Promise<UsersEntity[]> {
    return await this.usersService.findAll();
  }
}
