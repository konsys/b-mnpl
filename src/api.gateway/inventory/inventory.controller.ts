import {
  Controller,
  Get,
  Inject,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IField } from 'src/types/board/board.types';
import { IInventory } from 'src/types/game/game.types';
import { MsInventoryPatterns, MsNames } from 'src/types/ms/ms.types';

@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject(MsNames.INVENTORY)
    private readonly proxyInventory: ClientProxy,
  ) {}

  @Get(':userId')
  async getInventory(@Param() userId: number): Promise<IInventory> {
    try {
      const fields: IField[] = (await this.proxyInventory
        .send<any>({ cmd: MsInventoryPatterns.GET_USER_FIELDS }, { userId })
        .toPromise()) as IField[];
      return { fields };
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }
}
