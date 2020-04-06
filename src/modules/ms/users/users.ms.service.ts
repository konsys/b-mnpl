import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersMsService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.users.find({ take: 2 });
  }

  async findOne(): Promise<UsersEntity> {
    return await this.users.findOne(1);
  }

  async saveAll(users: UsersEntity[]): Promise<UsersEntity[]> {
    return await this.users.save(users);
  }
}
