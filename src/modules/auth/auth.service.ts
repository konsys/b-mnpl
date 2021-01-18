import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserCreds } from 'src/types/game/game.types';
import { UsersService } from 'src/api.gateway/users/users.service';
import { IJwtPayload } from 'src/config/config';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UsersEntity | undefined> {
    const user = await this.usersService.getUserByCredentials(email, password);

    return user && user.name ? user : undefined;
  }

  createPayload(username: string, userId: number): IJwtPayload {
    return {
      username,
      sub: userId,
    };
  }

  async signJwt(payload: IJwtPayload, expiresIn?: string): Promise<string> {
    return expiresIn
      ? this.jwtService.sign(payload, { expiresIn })
      : this.jwtService.sign(payload);
  }

  async login(
    user: IUserCreds,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: IJwtPayload = this.createPayload(user.name, user.userId);

    const accessToken = await this.signJwt(payload);
    const refreshToken = await this.signJwt(payload, '60000s');

    await this.usersService.saveToken(refreshToken, user.userId, user.name);

    return {
      accessToken,
      refreshToken,
    };
  }
}
