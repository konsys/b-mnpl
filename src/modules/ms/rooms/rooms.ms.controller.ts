import { Controller, Inject } from '@nestjs/common';
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
  IRoomType,
} from 'src/types/game/game.types';
import {
  MsRoomsPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { roomsRedis } from 'src/main';
import { IPlayer } from 'src/types/board/board.types';

enum Rooms {
  ALL = 'allRooms',
}
@Controller('rooms.ms')
export class RoomsMsController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly proxy: ClientProxy,
  ) {}

  @MessagePattern({ cmd: MsRoomsPatterns.GET_ROOMS })
  async getRooms(): Promise<IRoomResponce> {
    const rooms = await this.get(Rooms.ALL);
    return { rooms, playersInRooms: this.calcPlayers(rooms) };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom({ room }: { room: IRoomState }): Promise<IRoomResponce> {
    // TODO remove line
    await roomsRedis.del(Rooms.ALL);

    let rooms = await this.get(Rooms.ALL);

    const players: IPlayer[] = await this.proxy
      .send<any>(
        { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
        room.players.map((v) => v.userId),
      )
      .toPromise();

    const creator = players.find((v) => v.userId === room.creatorId);
    if (
      !creator.vip &&
      room.roomType !== IRoomType.REGULAR &&
      room.roomType !== IRoomType.SHUFFLE
    ) {
      throw new RpcException({ code: ErrorCode.NotVip });
    }

    room.players = players;
    // TODO uncomment
    // const isGame = rooms.find((v) => v.creatorId === room.creatorId);

    // if (isGame) {
    //   throw new RpcException({ code: ErrorCode.RoomExists });
    // }

    rooms.push(room);

    await this.set(Rooms.ALL, rooms);
    rooms = await this.get(Rooms.ALL);

    return { rooms, playersInRooms: this.calcPlayers(rooms) };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.ADD_PLAYER })
  async addPlayerToRoom({
    add,
  }: {
    add: IAddPlayerToRoom;
  }): Promise<IRoomResponce> {
    let rooms = await this.get(Rooms.ALL);
    const roomIndex = await this.findRoomIndex(rooms, add.roomId);

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
    return {
      rooms,
      playersInRooms: this.calcPlayers(rooms),
    };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.REMOVE_PLAYER })
  async removePlayerFromRoom({
    remove,
  }: {
    remove: IAddPlayerToRoom;
  }): Promise<IRoomResponce> {
    let rooms = await this.get(Rooms.ALL);

    const roomIndex = await this.findRoomIndex(rooms, remove.roomId);
    console.log(2222, roomIndex);
    const room = rooms[roomIndex];
    const playerIndex = room.players.findIndex(
      (v) => v.userId === remove.userId,
    );

    // TODO add check for me in room
    const player = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, remove.userId)
      .toPromise();

    rooms[roomIndex].players = room.players.splice(playerIndex, playerIndex); // push(player);

    await this.set(Rooms.ALL, rooms);

    rooms = await this.get(Rooms.ALL);
    return {
      rooms,
      playersInRooms: this.calcPlayers(rooms),
    };
  }

  private async findRoomIndex(rooms: IRoomState[], roomId: string) {
    const roomIndex = rooms.findIndex((v) => v.roomId === roomId);

    if (roomIndex < 0) {
      throw new RpcException({ code: ErrorCode.RoomDoesntExist });
    }

    return roomIndex;
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

  private calcPlayers(arr: IRoomState[]): number {
    return arr.reduce((acc, v) => acc + v.players.length, 0);
  }
}
