import { Transport } from '@nestjs/microservices';

interface IConfig {
  transport: Transport;
}

export const config: IConfig = {
  transport: Transport.NATS,
};

export interface IJwtSettings {
  secret: string;
  expires: string;
  refreshExpires: number;
}

export interface IJwtPayload {
  username: string;
  sub: number;
}

export const jwtConstants: IJwtSettings = {
  secret: 'secretKey',
  expires: '600s', // 10 minutes
  refreshExpires: 7 * 3600 * 24, // 7 days
};
