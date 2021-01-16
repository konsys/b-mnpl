import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserCreds } from 'src/types/game/game.types';
import { UsersService } from 'src/api.gateway/users/users.service';
import { IJwtPayload } from 'src/config/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.getUserByCredentials(email, password);
    return user && user.name ? true : false;
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

  // TODO add types for login
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
