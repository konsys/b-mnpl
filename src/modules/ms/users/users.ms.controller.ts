import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('init')
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  // @MessagePattern({ cmd: 'users' })
  async findAll(): Promise<any> {
    return Promise.resolve(12);
    //   return await this.users.find({ take: 2 });
  }

  @Get()
  getAll() {
    return 12345;
  }
}
