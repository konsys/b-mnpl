import { BadRequestException, Controller, Inject } from '@nestjs/common';
import {
  MessagePattern,
  RpcException,
  ClientProxy,
} from '@nestjs/microservices';

import { ErrorCode } from 'src/utils/error.code';
import { IRoomState } from 'src/types/game/game.types';
import {
  MsRoomsPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { roomsRedis } from 'src/main';

enum Rooms {
  ALL = 'allRooms',
}
@Controller('rooms.ms')
export class RoomsMsController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly proxy: ClientProxy,
  ) {}

  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom({ room }: { room: IRoomState }): Promise<IRoomState[]> {
    // TODO remove line
    await roomsRedis.del(Rooms.ALL);

    let str = await roomsRedis.get(Rooms.ALL);

    let rooms: IRoomState[] = [];
    try {
      rooms = JSON.parse(str);
    } catch (er) {
      //NOP
    }
    const players = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
        room.players.map((v) => v.userId),
      )
      .toPromise();

    rooms = Array.isArray(rooms) ? rooms : new Array();

    // TODO uncomment
    // const isGame = rooms.find((v) => v.creatorId === room.creatorId);

    // if (isGame) {
    //   throw new RpcException({ code: ErrorCode.RoomExists });
    // }
    rooms.push(room);

    await roomsRedis.set(Rooms.ALL, JSON.stringify(rooms));
    // TODO add expire for Rooms
    await roomsRedis.expire([Rooms.ALL, 10000]);
    return JSON.parse(await roomsRedis.get(Rooms.ALL));
  }
}
