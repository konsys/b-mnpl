import { BadRequestException, Controller, Inject } from '@nestjs/common';
import {
  MessagePattern,
  RpcException,
  ClientProxy,
} from '@nestjs/microservices';

import { ErrorCode } from 'src/utils/error.code';
import {
  IRoomState,
  IAddPlayerToRoom,
  IRoomResponce,
} from 'src/types/game/game.types';
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
  async createRoom({ room }: { room: IRoomState }): Promise<IRoomResponce> {
    // TODO remove line
    await roomsRedis.del(Rooms.ALL);

    let rooms = await this.get(Rooms.ALL);

    const players = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
        room.players.map((v) => v.userId),
      )
      .toPromise();

    room.players = players;
    // TODO uncomment
    // const isGame = rooms.find((v) => v.creatorId === room.creatorId);

    // if (isGame) {
    //   throw new RpcException({ code: ErrorCode.RoomExists });
    // }

    rooms.push(room);

    await this.set(Rooms.ALL, rooms);
    rooms = await this.get(Rooms.ALL);

    const t = rooms.reduce((acc, v) => acc + v.players.length, 0);
    console.log(234234234, t);
    return { rooms, playersInRooms: 3 };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.ADD_PLAYER })
  async addPlayerToRoom({
    add,
  }: {
    add: IAddPlayerToRoom;
  }): Promise<IRoomResponce> {
    let rooms = await this.get(Rooms.ALL);
    const roomIndex = rooms.findIndex((v) => v.roomId === add.roomId);
    if (roomIndex < 0) {
      throw new RpcException({ code: ErrorCode.RoomDoesntExist });
    }

    if (rooms[roomIndex].players.length >= rooms[roomIndex].playersNumber) {
      throw new RpcException({ code: ErrorCode.RoomMaxPlayersReached });
    }

    // TODO add check for me in room
    const player = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, add.userId)
      .toPromise();

    rooms[roomIndex].players.push(player);

    await this.set(Rooms.ALL, rooms);

    rooms = await this.get(Rooms.ALL);
    const num = rooms.reduce((acc, v) => acc + v.players.length, 0);
    return {
      rooms,
      playersInRooms: num,
    };
  }

  private async set(name: string, value: any) {
    await roomsRedis.set(name, JSON.stringify(value));
    await roomsRedis.expire([Rooms.ALL, 10000]);
    return;
  }

  private async get(name: string): Promise<IRoomState[]> {
    try {
      const rooms = JSON.parse(await roomsRedis.get(name));
      return Array.isArray(rooms) ? rooms : [];
    } catch (err) {
      return [];
    }
  }
}
