import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsInventoryPatterns, MsNames } from 'src/types/ms/ms.types';

@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject(MsNames.INVENTORY)
    private readonly proxyInventory: ClientProxy,
  ) {}

  @Get('userId')
  async getInventory(@Param() userId) {
    try {
      return '1';
      const messages = JSON.stringify(
        await this.proxyInventory
          .send<any>({ cmd: MsInventoryPatterns.GET_USER_FIELDS }, { userId })
          .toPromise(),
      );
      return messages;
    } catch (err) {
      // TODO Logging
    }
  }
}
