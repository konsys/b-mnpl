import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MsPatterns } from 'src/types/MS/ms.types';

@Controller()
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  @MessagePattern({ cmd: MsPatterns.GET_ALL_USERS })
  async allUsers(filter: FindManyOptions) {
    filter = { ...filter, skip: 1 };
    const users: any = await this.users.find(filter);
    return of(users).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsPatterns.GET_USER })
  async getUser(userId: number) {
    const user: any = await this.users.findOne(userId);

    return of(user).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsPatterns.GET_USERS_BY_IDS })
  async getUsers(userIds: number[]) {
    // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
    const user: UsersEntity[] = await this.users.find({
      userId: In([1, 2, 3]),
    });

    return of(user).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsPatterns.GET_USER_BY_CREDENTIALS })
  async verifyUsers(filter: any) {
    const user: UsersEntity = await this.users.findOne({ email: filter.email });

    return of(user).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsPatterns.SAVE_USERS })
  async saveUsers(users: UsersEntity[]) {
    const allUsers: UsersEntity[] = await this.users.save(users);
    return of(allUsers).pipe(delay(1));
  }
}
