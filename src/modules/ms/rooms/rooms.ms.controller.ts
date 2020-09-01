import { BadRequestException, Controller } from '@nestjs/common';

import { IRoomState } from 'src/types/game/game.types';
import { MessagePattern } from '@nestjs/microservices';
import { MsRoomsPatterns } from 'src/types/ms/ms.types';
import { roomsRedis } from 'src/main';

enum Rooms {
  ALL = 'allRooms',
}
@Controller('rooms.ms')
export class RoomsMsController {
  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom({ room }: { room: IRoomState }): Promise<IRoomState[]> {
    let str = await roomsRedis.get(Rooms.ALL);

    let rooms: IRoomState[] = [];
    try {
      rooms = JSON.parse(str);
    } catch (er) {
      //NOP
    }

    rooms = Array.isArray(rooms) ? rooms : new Array();
    const isGame = rooms.find((v) => v.creatorId === room.creatorId);
    // TODO add error handler
    if (isGame) {
      throw new BadRequestException('Game exists');
    }
    rooms.push(room);

    await roomsRedis.set(Rooms.ALL, JSON.stringify(rooms));
    // TODO add expire for Rooms
    await roomsRedis.expire([Rooms.ALL, 1]);
    return JSON.parse(await roomsRedis.get(Rooms.ALL));
  }
}
