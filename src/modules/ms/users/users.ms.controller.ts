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
import { jwtConstants } from 'src/modules/auth/jwt.params';

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
    name,
  }: {
    token: string;
    userId: number;
    name: string;
  }): Promise<any> {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + jwtConstants.refreshExpires);
    const saveToken: TokensEntity = {
      userId,
      name,
      expires,
      token,
    };

    const res: TokensEntity = await this.tokens.save(saveToken);
    return of(res).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN })
  async getToken(token: string): Promise<any> {
    const res: TokensEntity = await this.tokens.findOne({ token });
    if (res) {
      res.expires.setSeconds(
        res.expires.getSeconds() + jwtConstants.refreshExpires,
      );
      await this.tokens.save(res);
    }

    return of(res).pipe(delay(1));
  }

  @MessagePattern({ cmd: MsUsersPatterns.DELETE_REFRESH_TOKEN })
  async deleteToken(token: string): Promise<any> {
    try {
      await this.tokens.delete({ token });
    } catch (err) {
      console.log(1111111);
    }

    return of(true).pipe(delay(1));
  }
}
