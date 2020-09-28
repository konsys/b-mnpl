import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {
  MsFieldsPatterns,
  MsInventoryPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { IPlayer } from 'src/types/board/board.types';
import { UsersEntity } from 'src/entities/users.entity';

@Controller('rooms.ms')
export class InventoryMsController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly usersMs: ClientProxy,
    @Inject(MsNames.FIELDS)
    private readonly fieldsMs: ClientProxy,
  ) {}

  @MessagePattern({ cmd: MsInventoryPatterns.GET_USER_FIELDS })
  async getRoom({ userId }: { userId: number }): Promise<any> {
    const user: UsersEntity = await this.usersMs
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, userId)
      .toPromise();

    const fields: UsersEntity = await this.fieldsMs
      .send<any>({ cmd: MsFieldsPatterns.GET_FIELDS_BY_IDS }, user.fieldIds)
      .toPromise();

    return fields;
  }
}
