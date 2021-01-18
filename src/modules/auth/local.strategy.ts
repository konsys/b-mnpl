import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ErrorCode } from 'src/utils/error.code';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // http://www.passportjs.org/docs/configure/
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(_: Request, email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException(ErrorCode.WrongCreds);
    }
    return user ? user : null;
  }
}
