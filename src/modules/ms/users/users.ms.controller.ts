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
import {
  IUserCreds,
  IVkToken,
  IVkUserResponce,
} from 'src/types/game/game.types';
import { jwtConstants } from 'src/config/config';
import queryString from 'query-string';
import fetch from 'node-fetch';

@Controller()
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
    @InjectRepository(TokensEntity)
    private readonly tokens: Repository<TokensEntity>,
  ) {}

  @MessagePattern({ cmd: MsUsersPatterns.GET_ALL_USERS })
  async allUsers(filter: FindManyOptions): Promise<UsersEntity[]> {
    filter = { ...filter, skip: 1 };
    const users: any = await this.users.find(filter);
    return users;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ cmd: MsUsersPatterns.GET_USER })
  async getUser(userId: number): Promise<UsersEntity> {
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
  async getUserByCredentials(creds: IUserCreds): Promise<UsersEntity> {
    const user: UsersEntity = await this.users.findOne(creds);
    return user;
  }

  @MessagePattern({ cmd: MsUsersPatterns.SAVE_USERS })
  async saveUsers(users: UsersEntity[]): Promise<UsersEntity[]> {
    const allUsers: UsersEntity[] = await this.users.save(users);
    return allUsers;
  }

  @MessagePattern({ cmd: MsUsersPatterns.SAVE_USER })
  async saveUser(user: UsersEntity): Promise<UsersEntity> {
    user = new UsersEntity(user);
    const savedUser = await this.users.save({
      ...user,
      vip: !!user.vip,
    });

    return savedUser;
  }

  @MessagePattern({ cmd: MsUsersPatterns.UPDATE_USER })
  async updateUser(user: UsersEntity): Promise<boolean> {
    user = new UsersEntity(user);
    const update = await this.users.update({ userId: user.userId }, user);

    return update && update.affected > 0 ? true : false;
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
  }): Promise<TokensEntity> {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + jwtConstants.refreshExpires);

    const saveToken: TokensEntity = {
      userId,
      name,
      expires,
      token,
    };

    let res = null;
    try {
      res = await this.tokens.save(saveToken);
    } catch (err) {
      res = await this.tokens.update({ userId }, { expires, token });
    }

    return res;
  }

  @MessagePattern({ cmd: MsUsersPatterns.ACTIVATE_USER })
  async activateUser({
    registrationCode,
    email,
  }: {
    registrationCode: string;
    email: string;
  }): Promise<boolean> {
    const user: UsersEntity = await this.users.findOne({
      registrationCode,
      email,
    });

    if (!user) {
    }
    const res = await this.users.update(
      { registrationCode, email },
      { isActive: true },
    );

    return res && res.affected > 0 ? true : false;
  }

  @MessagePattern({ cmd: MsUsersPatterns.GET_REFRESH_TOKEN })
  async getToken(token: string): Promise<TokensEntity> {
    const res: TokensEntity = await this.tokens.findOne({ token });
    return res;
  }

  @MessagePattern({ cmd: MsUsersPatterns.DELETE_REFRESH_TOKEN })
  async deleteToken(token: string): Promise<boolean> {
    try {
      const res = await this.tokens.delete({ token });
      return res.affected > 0;
    } catch (err) {
      console.log('Error deleting refresh token', err);
      return false;
    }
  }

  @MessagePattern({ cmd: MsUsersPatterns.DELETE_USER })
  async deleteUser(userId: number): Promise<boolean> {
    try {
      const res = await this.users.delete({ userId, isTestUser: true });
      return res.affected > 0;
    } catch (err) {
      console.log('Error deleting user', err);
      return false;
    }
  }

  @MessagePattern({ cmd: MsUsersPatterns.LOGIN_VK })
  async loginVK(code: string): Promise<UsersEntity | null> {
    const params = {
      redirect_uri: 'http://127.0.0.1:3000/login',
      client_secret: 'tCN1UAM5eoVrBWtHSMw1',
      client_id: 7731384,
      code,
      v: 5.126,
    };
    const stringified = queryString.stringify(params);

    const link = `https://oauth.vk.com/access_token?${stringified}`;
    let response = await fetch(link);
    const tokenData: IVkToken = JSON.parse(await response.text());

    const userData = {
      user_ids: tokenData.user_id,
      access_token: tokenData.access_token,
      client_id: 7731384,
      fields: 'sex,bdate,photo_100,email',
      v: 5.126,
    };
    const stringifiedUser = queryString.stringify(userData);

    const userGet = `https://api.vk.com/method/users.get?${stringifiedUser}`;

    response = await fetch(userGet);
    const usersData: IVkUserResponce[] = JSON.parse(await response.text())
      .response;

    const user = usersData && usersData.length ? usersData[0] : null;

    const isUser = await this.users.findOne({ vkId: user.id });
    let savedUser = null;
    if (user) {
      if (!isUser && !isUser.userId) {
        savedUser = await this.users.save({
          avatar: user.photo_100,
          firstName: user.first_name,
          lastName: user.last_name,
          registrationType: 'vk',
          name: user.first_name + ' ' + user.last_name,
          isActive: true,
          isBlocked: false,
          sex: user.sex,
          vip: false,
          vkId: user.id,
          email: tokenData.email || null,
        });
      } else if (isUser && isUser.userId) {
        await this.users.update(
          { vkId: user.id },
          {
            avatar: user.photo_100,
            firstName: user.first_name,
            lastName: user.last_name,
            registrationType: 'vk',
            name: user.first_name + ' ' + user.last_name,
            isActive: true,
            isBlocked: false,
            sex: user.sex,
            vip: false,
            email: tokenData.email || null,
          },
        );
        savedUser = await this.users.findOne({ vkId: user.id });
      }
    }

    return savedUser;
  }
}
