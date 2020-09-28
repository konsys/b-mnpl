import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MsNames } from 'src/types/ms/ms.types';

@Controller('rooms.ms')
export class InventoryMsController {
  constructor(
    @Inject(MsNames.INVENTORY)
    private readonly proxy: ClientProxy,
  ) {}
}
