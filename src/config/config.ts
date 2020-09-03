import { Transport } from '@nestjs/microservices';

interface IConfig {
  transport: Transport;
}

export const config: IConfig = {
  transport: Transport.NATS,
};
