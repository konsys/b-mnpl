import { Transport } from '@nestjs/microservices';

interface IConfig {
  useTransport: Transport.TCP;
}

export const settings: IConfig = {
  useTransport: Transport.TCP,
};
