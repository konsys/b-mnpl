export interface IJwtSettings {
  secret: string;
  expires: string;
  refreshExpires: string;
}

export const jwtConstants: IJwtSettings = {
  secret: 'secretKey',
  expires: '60s',
  refreshExpires: '6000000s',
};
