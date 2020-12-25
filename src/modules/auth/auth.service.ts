import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from '../../api.gateway/users/users.service';
import { IJwtPayload, jwtConstants } from './jwt.params';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.getUserByCredentials(email, password);
    return user ? user : null;
  }

  createPayload(username: string, userId: number): IJwtPayload {
    return {
      username,
      sub: userId,
    };
  }

  async signJwt(
    payload: IJwtPayload,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  // TODO add types for login
  async login(
    user: UsersEntity | any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: IJwtPayload = this.createPayload(user.name, user.userId);

    const accessToken = await this.signJwt(
      payload,
      jwtConstants.secret,
      jwtConstants.expires,
    );

    const refreshToken = await this.signJwt(
      payload,
      jwtConstants.secret,
      jwtConstants.refreshExpires,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
