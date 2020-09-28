import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {
  MsInventoryPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { IPlayer } from 'src/types/board/board.types';

@Controller('rooms.ms')
export class InventoryMsController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly usersMs: ClientProxy,
  ) {}

  @MessagePattern({ cmd: MsInventoryPatterns.GET_USER_FIELDS })
  async getRoom({ userId }: { userId: number }): Promise<any> {
    const player: IPlayer = await this.usersMs
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, userId)
      .toPromise();
    return player;
  }
}
