import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { MessagePattern } from '@nestjs/microservices';
import { MsPatterns } from 'src/types/ms.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('init')
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  // @MessagePattern({ cmd: MsPatterns.getAllUsers })
  // async findAll(): Promise<UsersEntity[]> {
  //   return await this.users.find({ take: 2 });
  // }

  @Get()
  getAll() {
    return 12345;
  }
}
