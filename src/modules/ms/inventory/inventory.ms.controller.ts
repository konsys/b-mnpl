import { Controller, Inject, NotFoundException } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import {
  MsFieldsPatterns,
  MsInventoryPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { ErrorCode } from 'src/utils/error.code';
import { IInventory, InventoryType } from 'src/types/game/game.types';
import { IField } from 'src/types/board/board.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from 'src/entities/invenory.entity';

@Controller('rooms.ms')
export class InventoryMsController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly usersMs: ClientProxy,
    @Inject(MsNames.FIELDS)
    private readonly fieldsMs: ClientProxy,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,
  ) {}

  @MessagePattern({ cmd: MsInventoryPatterns.GET_USER_FIELDS })
  async getInventory({ userId }: { userId: number }): Promise<IInventory> {
    try {
      const user: UsersEntity = await this.usersMs
        .send<any>({ cmd: MsUsersPatterns.GET_USER }, userId)
        .toPromise();

      const fieldsInventory = user.inventory.filter(
        (v) => v.inventoryType === InventoryType.CARDS,
      );

      const fields: IField[] = await this.fieldsMs
        .send<any>(
          { cmd: MsFieldsPatterns.GET_FIELDS_BY_IDS },
          fieldsInventory.map((v) => v.inventoryId),
        )
        .toPromise();

      return { fields };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: MsInventoryPatterns.ADD_INVENTORY })
  async addInventory(inventory: any): Promise<any> {
    await this.inventoryRepository.save(inventory);
    return this.inventoryRepository.find();
  }
}
