export interface IJwtSettings {
  secret: string;
  expires: string;
}

export const jwtConstants: IJwtSettings = {
  secret: 'secretKey',
  expires: '6000000s',
};
