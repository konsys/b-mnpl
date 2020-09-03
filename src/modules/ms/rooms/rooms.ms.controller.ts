import { BadRequestException, Controller, Inject } from '@nestjs/common';
import {
  MessagePattern,
  RpcException,
  ClientProxy,
} from '@nestjs/microservices';

import { ErrorCode } from 'src/utils/error.code';
import { IRoomState, IAddPlayerToRoom } from 'src/types/game/game.types';
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

    let rooms = await this.get(Rooms.ALL);

    console.log(rooms);

    const players = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
        room.players.map((v) => v.userId),
      )
      .toPromise();

    // TODO uncomment
    // const isGame = rooms.find((v) => v.creatorId === room.creatorId);

    // if (isGame) {
    //   throw new RpcException({ code: ErrorCode.RoomExists });
    // }

    rooms.push(room);

    await this.set(Rooms.ALL, rooms);

    return await this.get(Rooms.ALL);
  }

  @MessagePattern({ cmd: MsRoomsPatterns.ADD_PLAYER })
  async addPlayerToRoom({
    add,
  }: {
    add: IAddPlayerToRoom;
  }): Promise<IRoomState[]> {
    console.log(1212121, add);

    return await this.get(Rooms.ALL);
  }

  private async set(name: string, value: any) {
    await roomsRedis.set(name, JSON.stringify(value));
    await roomsRedis.expire([Rooms.ALL, 10000]);
    return;
  }

  private async get(name: string) {
    try {
      const rooms = JSON.parse(await roomsRedis.get(name));
      return Array.isArray(rooms) ? rooms : [];
    } catch (err) {
      return [];
    }
  }
}
