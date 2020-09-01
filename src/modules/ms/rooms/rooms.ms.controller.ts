import { Controller } from '@nestjs/common';
import { IRoomState } from 'src/types/game/game.types';
import { MessagePattern } from '@nestjs/microservices';
import { MsRoomsPatterns } from 'src/types/ms/ms.types';

@Controller('rooms.ms')
export class RoomsMsController {
  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom(room: IRoomState): Promise<IRoomState[] | string> {
    console.log(123123123123, room);
    return 'createRoom';
  }
}
