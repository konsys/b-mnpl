import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from '../../api.gateway/users/users.service';

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

  // TODO add types for login
  async login(
    user: UsersEntity | any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      username: user.name,
      sub: user.userId,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'ergergewrf3w4r5t432tr4t', // unique access secret from environment vars
      expiresIn: 24 * 60 * 60 * 1000, // unique access expiration from environment vars
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'ergergewrf3w4r5t432tr4t', // unique refresh secret from environment vars
      expiresIn: 24 * 60 * 60 * 1000, // unique refresh expiration from environment vars
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
