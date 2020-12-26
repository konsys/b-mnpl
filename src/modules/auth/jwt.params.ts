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
  expires: '5s',
  refreshExpires: 20, //seconds
};
