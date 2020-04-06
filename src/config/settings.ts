import { Transport } from '@nestjs/common/enums/transport.enum';

// const Transport = require('@nestjs/common/enums/transport.enum');
interface IConfig {
  useTransport: Transport.NATS;
}

export const settings: IConfig = {
  useTransport: Transport.NATS,
};
