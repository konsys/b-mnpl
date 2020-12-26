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
  expires: '10s',
  refreshExpires: 60 * 60, //seconds
};
