import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { TokensEntity } from 'src/entities/tokens.entity';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MsUsersPatterns } from 'src/types/ms/ms.types';
import { ErrorCode } from 'src/utils/error.code';

@Controller()
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
    @InjectRepository(TokensEntity)
    private readonly tokens: Repository<TokensEntity>,
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
    if (!user) {
      throw new RpcException({ code: ErrorCode.UserDoesntExists });
    }
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
  async verifyUsers(filter: any): Promise<any> {
    const user: UsersEntity = await this.users.findOne({ email: filter.email });

    return of(user).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.SAVE_USERS })
  async saveUsers(users: UsersEntity[]): Promise<any> {
    const allUsers: UsersEntity[] = await this.users.save(users);
    return of(allUsers).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.SAVE_REFRESH_TOKEN })
  async saveToken({
    token,
    userId,
  }: {
    token: string;
    userId: number;
  }): Promise<any> {
    const saveToken: TokensEntity = {
      userId,
      expires: new Date(),
      token,
    };
    const res: TokensEntity = await this.tokens.save(saveToken);
    return of(res).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN })
  async getToken(userId: number): Promise<any> {
    const res: TokensEntity = await this.tokens.findOne({ userId });
    console.log(222222222222, res);
    return of(res).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN })
  async deleteToken(userId: number): Promise<any> {
    await this.tokens.delete({ userId });
    return of(true).pipe(delay(1));
  }
}
