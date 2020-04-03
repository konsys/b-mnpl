import { Controller, Get, Post } from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from 'src/entities/dbData';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UsersEntity)
    private usersService: Repository<UsersEntity>,
  ) {}

  @Get()
  async get(): Promise<string> {
    const fields = await this.usersService.find();
    return JSON.stringify(fields);
  }

  @Post()
  async save(): Promise<string> {
    const res = await this.usersService.save(users);
    return JSON.stringify(res);
  }
}
