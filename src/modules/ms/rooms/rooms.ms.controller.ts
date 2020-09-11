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
  RoomType,
  SocketActions,
  IResponceCode,
  RoomStatus,
} from 'src/types/game/game.types';
import {
  MsRoomsPatterns,
  MsNames,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { roomsRedis, redis } from 'src/main';
import { IPlayer } from 'src/types/board/board.types';
import { PlayerRoomStatus, RoomPlayer } from 'src/types/game/game.types';

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
  async createRoom({ room }: { room: IRoomState }): Promise<IResponceCode> {
    try {
      let rooms = await this.get(Rooms.ALL);

      const players: IPlayer[] = await this.proxy
        .send<any>(
          { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
          room.players.map((v) => v.userId),
        )
        .toPromise();

      const creator = players.find((v) => v.userId === room.creatorId);
      if (!creator || !Array.isArray(players)) {
        throw new RpcException({ code: ErrorCode.UserDoesntExists });
      }

      if (
        !creator.vip &&
        room.roomType !== RoomType.REGULAR &&
        room.roomType !== RoomType.SHUFFLE
      ) {
        throw new RpcException({ code: ErrorCode.NotVip });
      }

      room.creatorId = creator.userId;
      room.players = players.map((v) => ({
        ...v,
        playerRoomStatus: PlayerRoomStatus.ACITVE,
      }));
      room.roomStatus = RoomStatus.PENDING;
      //   throw new RpcException({ code: ErrorCode.RoomExists });
      // if (isGame) {
      // const isGame = rooms.find((v) => v.creatorId === room.creatorId);
      // TODO uncomment
      // }

      rooms.push(room);

      await this.set(Rooms.ALL, rooms);
      rooms = await this.get(Rooms.ALL);

      const resp = {
        rooms,
        playersInRooms: this.calcPlayers(rooms),
      };
      await redis.publish(
        `${SocketActions.ROOMS_MESSAGE}`,
        JSON.stringify(resp),
      );
      return { code: 0 };
    } catch (er) {
      return { code: 1 };
    }
  }

  @MessagePattern({ cmd: MsRoomsPatterns.ADD_PLAYER })
  async addPlayerToRoom({
    add,
  }: {
    add: IAddPlayerToRoom;
  }): Promise<IResponceCode> {
    try {
      let rooms = await this.get(Rooms.ALL);
      const roomIndex = await this.findRoomIndex(rooms, add.roomId);
      const room = rooms[roomIndex];
      if (room.players.length >= room.playersNumber) {
        throw new RpcException({ code: ErrorCode.RoomMaxPlayersReached });
      }

      // TODO add check for me in room
      const player: RoomPlayer = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_USER }, add.userId)
        .toPromise();

      rooms[roomIndex].players.push({
        ...player,
        playerRoomStatus: PlayerRoomStatus.ACITVE,
      });

      if (rooms[roomIndex].players.length === room.playersNumber) {
        rooms[roomIndex].roomStatus = RoomStatus.STARTED;
      }

      await this.set(Rooms.ALL, rooms);

      rooms = await this.get(Rooms.ALL);
      const resp = {
        rooms,
        playersInRooms: this.calcPlayers(rooms),
      };
      await redis.publish(
        `${SocketActions.ROOMS_MESSAGE}`,
        JSON.stringify(resp),
      );
      return { code: 0 };
    } catch (er) {
      return { code: 1 };
    }
  }

  @MessagePattern({ cmd: MsRoomsPatterns.REMOVE_PLAYER })
  async removePlayerFromRoom({
    remove,
  }: {
    remove: IAddPlayerToRoom;
  }): Promise<IResponceCode> {
    try {
      let rooms = await this.get(Rooms.ALL);
      const roomIndex = await this.findRoomIndex(rooms, remove.roomId);
      const room = rooms[roomIndex];
      const playerIndex = room.players.findIndex(
        (v) => v.userId === remove.userId,
      );
      room.players.splice(playerIndex, 1);
      rooms[roomIndex].players = room.players; // push(player);
      await this.set(Rooms.ALL, rooms);
      rooms = await this.get(Rooms.ALL);
      const resp = {
        rooms,
        playersInRooms: this.calcPlayers(rooms),
      };
      await redis.publish(
        `${SocketActions.ROOMS_MESSAGE}`,
        JSON.stringify(resp),
      );
      return { code: 0 };
    } catch (er) {
      return { code: 1 };
    }
  }

  @MessagePattern({ cmd: MsRoomsPatterns.DELETE_ROOMS })
  public async deleteRoooms() {
    console.log('DELETE ROOMS');
    return await roomsRedis.del(Rooms.ALL);
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
      let rooms = JSON.parse(await roomsRedis.get(name));

      if (!Array.isArray(rooms)) {
        rooms = [];
      } else {
        rooms = rooms.filter((v) => v.players.length > 0);
      }

      await this.set(Rooms.ALL, rooms);

      return rooms;
    } catch (err) {
      return [];
    }
  }

  private calcPlayers(arr: IRoomState[]): number {
    return arr.reduce((acc, v) => acc + v.players.length, 0);
  }
}
