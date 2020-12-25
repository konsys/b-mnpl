export interface IJwtSettings {
  secret: string;
  expires: string;
  refreshExpires: string;
}

export interface IJwtPayload {
  username: string;
  sub: number;
}

export const jwtConstants: IJwtSettings = {
  secret: 'secretKey',
  expires: '10s',
  refreshExpires: '6000000s',
};
