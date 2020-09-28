import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MsUsersPatterns } from 'src/types/ms/ms.types';

@Controller()
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  @MessagePattern({ cmd: MsUsersPatterns.GET_ALL_USERS })
  async allUsers(filter: FindManyOptions) {
    filter = { ...filter, skip: 1 };
    const users: any = await this.users.find(filter);
    return of(users).pipe(delay(1));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ cmd: MsUsersPatterns.GET_USER })
  async getUser(userId: number) {
    const user: UsersEntity = await this.users.findOne(userId);
    return new UsersEntity(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ cmd: MsUsersPatterns.GET_USERS_BY_IDS })
  async getUsers(userIds: number[]): Promise<UsersEntity[]> {
    if (!userIds || !userIds.length) {
      return await of([]).pipe(delay(1)).toPromise();
    }

    // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
    const users: UsersEntity[] = await this.users.find({
      userId: In(userIds),
    });

    const filtered = users.map((v) => new UsersEntity(v));
    return await of(filtered).pipe(delay(1)).toPromise();
  }

  @MessagePattern({ cmd: MsUsersPatterns.GET_USER_BY_CREDENTIALS })
  async verifyUsers(filter: any) {
    const user: UsersEntity = await this.users.findOne({ email: filter.email });

    return of(user).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.SAVE_USERS })
  async saveUsers(users: UsersEntity[]) {
    const allUsers: UsersEntity[] = await this.users.save(users);
    return of(allUsers).pipe(delay(1));
  }
}
