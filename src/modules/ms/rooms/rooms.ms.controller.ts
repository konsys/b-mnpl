import { Controller, Inject } from '@nestjs/common';
import {
  MessagePattern,
  RpcException,
  ClientProxy,
} from '@nestjs/microservices';

import { ErrorCode } from 'src/utils/error.code';
import {
  IRoomState,
  IPlayerRoom,
  IRoomResponce,
  RoomType,
  SocketActions,
  IResponceCode,
  RoomStatus,
  IBoardParams,
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

  @MessagePattern({ cmd: MsRoomsPatterns.GET_ROOM })
  async getRoom({ roomId }: { roomId: string }): Promise<IBoardParams> {
    return await this.get(roomId);
  }

  @MessagePattern({ cmd: MsRoomsPatterns.GET_ROOMS })
  async getRooms(): Promise<IRoomResponce> {
    const rooms = await this.getAllRooms();
    return { rooms, playersInRooms: this.calcPlayers(rooms) };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom({ room }: { room: IRoomState }): Promise<IResponceCode> {
    try {
      let updateRoom = await this.get(room.roomId);

      const players: IPlayer[] = await this.proxy
        .send<any>(
          { cmd: MsUsersPatterns.GET_USERS_BY_IDS },
          updateRoom.players.map((v) => v.userId),
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

      await this.set(room.roomId, updateRoom);

      const rooms = await this.getAllRooms();

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
  async addPlayerToRoom({ add }: { add: IPlayerRoom }): Promise<IResponceCode> {
    try {
      const room = await this.get(add.roomId);
      if (room.players.length >= room.playersNumber) {
        throw new RpcException({ code: ErrorCode.RoomMaxPlayersReached });
      }

      // TODO add check for me in room
      const player: RoomPlayer = await this.proxy
        .send<any>({ cmd: MsUsersPatterns.GET_USER }, add.userId)
        .toPromise();

      room.players.push({
        ...player,
        playerRoomStatus: PlayerRoomStatus.ACITVE,
      });

      if (room.players.length === room.playersNumber) {
        room.roomStatus = RoomStatus.STARTED;
      }

      const rooms = await this.getAllRooms();

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
    remove: IPlayerRoom;
  }): Promise<IResponceCode> {
    try {
      const room = await this.get(remove.roomId);
      const playerIndex = room.players.findIndex(
        (v) => v.userId === remove.userId,
      );
      room.players.splice(playerIndex, 1);

      await this.set(remove.roomId, room);
      const rooms = await this.getAllRooms();

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
    return await roomsRedis.del(Rooms.ALL);
  }

  @MessagePattern({ cmd: MsRoomsPatterns.PLAYER_SURRENDER })
  public async playerSurrender(el: IPlayerRoom) {
    const room = await this.get(el.roomId);
    if (room) {
      const userIndex = room.players.findIndex((v) => v.userId === el.userId);
      if (userIndex >= 0) {
        room.players = room.players.splice(userIndex, 1);
        // return await roomsRedis.del(Rooms.ALL);
        console.log('playerSurrender', userIndex, room);
      }
    }

    return false;
  }

  private async findRoomIndex(rooms: IRoomState[], roomId: string) {
    const roomIndex = rooms.findIndex((v) => v.roomId === roomId);

    if (roomIndex < 0) {
      throw new RpcException({ code: ErrorCode.RoomDoesntExist });
    }
    return roomIndex;
  }

  private async set(id: string, value: any) {
    const redisId = `${Rooms.ALL}-${id}`;
    await roomsRedis.set(redisId, JSON.stringify(value));
    await roomsRedis.expire([redisId, 10000]);

    const rooms = await this.getAllRooms();
    rooms[redisId] = value;
    await roomsRedis.set(Rooms.ALL, JSON.stringify(rooms));
    await roomsRedis.expire([Rooms.ALL, 10000]);
    return;
  }

  private async get(id: string): Promise<IRoomState | null> {
    const redisId = `${Rooms.ALL}-${id}`;
    try {
      let room = JSON.parse(await roomsRedis.get(redisId));

      return room;
    } catch (err) {
      try {
        roomsRedis.del(redisId);
      } catch (err) {}
    }

    return null;
  }

  private async getAllRooms(): Promise<any> {
    try {
      let rooms = JSON.parse(await roomsRedis.get(Rooms.ALL));

      return rooms;
    } catch (err) {}

    return {};
  }

  private calcPlayers(arr: IRoomState[]): number {
    return arr.reduce((acc, v) => acc + v.players.length, 0);
  }
}
