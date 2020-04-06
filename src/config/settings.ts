import { Transport } from '@nestjs/common/enums/transport.enum';

// const Transport = require('@nestjs/common/enums/transport.enum');
export interface Config {
  useTransport: Transport.NATS;
}
export const settings: Config = {
  useTransport: Transport.NATS,
};
