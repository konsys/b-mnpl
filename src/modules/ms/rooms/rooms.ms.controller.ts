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
    const room = await this.get(roomId);
    return room;
  }

  @MessagePattern({ cmd: MsRoomsPatterns.GET_ROOMS })
  async getRooms(): Promise<IRoomResponce> {
    const rooms = await this.getAllRooms();
    return { rooms, playersInRooms: this.calcPlayers(rooms) };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.CREATE_ROOM })
  async createRoom({ room }: { room: IRoomState }): Promise<IResponceCode> {
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

    room.players = players.map((v) => ({
      ...v,
      playerRoomStatus: PlayerRoomStatus.ACITVE,
    }));
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

    await this.set(room.roomId, room);

    const rooms = await this.getAllRooms();

    const resp = {
      rooms,
      playersInRooms: this.calcPlayers(rooms),
    };

    await redis.publish(`${SocketActions.ROOMS_MESSAGE}`, JSON.stringify(resp));
    return { code: 0 };
  }

  @MessagePattern({ cmd: MsRoomsPatterns.ADD_PLAYER })
  async addPlayerToRoom({ add }: { add: IPlayerRoom }): Promise<IResponceCode> {
    try {
      const room = await this.get(add.roomId);
      if (!room) {
        throw new RpcException({ code: ErrorCode.RoomDoesntExist });
      }

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
        room.roomStatus = RoomStatus.PLAYING;
      }

      await this.set(room.roomId, room);
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
      throw new RpcException(er && er.error ? er.error : { code: 1 });
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

      if (room.players.length < 1) {
        await this.deleteRoom(room.roomId);
      } else {
        await this.set(remove.roomId, room);
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
      throw new RpcException(er && er.error ? er.error : { code: 1 });
    }
  }

  @MessagePattern({ cmd: MsRoomsPatterns.DELETE_ROOMS })
  public async deleteRoooms() {
    let rooms = await this.getAllRooms();
    for (let room of rooms) {
      await this.deleteRoom(room.roomId);
    }
    rooms = await this.getAllRooms();
    const resp = {
      rooms,
      playersInRooms: this.calcPlayers(rooms),
    };

    return await redis.publish(
      `${SocketActions.ROOMS_MESSAGE}`,
      JSON.stringify(resp),
    );
  }

  @MessagePattern({ cmd: MsRoomsPatterns.PLAYER_SURRENDER })
  public async playerSurrender(el: IPlayerRoom) {
    try {
      const room = await this.get(el.roomId);
      if (room) {
        const userIndex = room.players.findIndex((v) => v.userId === el.userId);
        if (userIndex >= 0) {
          room.players[userIndex] = {
            ...room.players[userIndex],
            playerRoomStatus: PlayerRoomStatus.SURRENDERED,
          };
          const activePlayers = room.players.filter(
            (v) => v.playerRoomStatus === PlayerRoomStatus.ACITVE,
          );
          if (activePlayers.length === 1) {
            await this.set(room.roomId, {
              ...room,
              roomStatus: RoomStatus.COMPLETED,
            });
          }

          const rooms = await this.getAllRooms();

          const resp = {
            rooms,
            playersInRooms: this.calcPlayers(rooms),
          };

          return await redis.publish(
            `${SocketActions.ROOMS_MESSAGE}`,
            JSON.stringify(resp),
          );
        }
      }
      return { code: 0 };
    } catch (er) {
      throw new RpcException(er && er.error ? er.error : { code: 1 });
    }
  }

  private async set(id: string, room: IRoomState) {
    const redisId = `${Rooms.ALL}-${id}`;

    await roomsRedis.set(redisId, JSON.stringify(room));
    await roomsRedis.expire([redisId, 10000]);

    let rooms = await this.getAllRooms();

    rooms = !rooms ? [] : rooms;

    const roomIndex = rooms.findIndex((v) => v.roomId === room.roomId);
    roomIndex < 0 ? rooms.push(room) : (rooms[roomIndex] = room);
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

  private async deleteRoom(roomId: string): Promise<boolean> {
    try {
      let rooms = JSON.parse(await roomsRedis.get(Rooms.ALL));

      rooms = rooms.filter((v) => v.roomId !== roomId);

      await roomsRedis.set(Rooms.ALL, JSON.stringify(rooms));

      return true;
    } catch (err) {}

    return false;
  }

  private async getAllRooms(): Promise<IRoomState[]> {
    try {
      let rooms = JSON.parse(await roomsRedis.get(Rooms.ALL));

      return rooms ? rooms : [];
    } catch (err) {}

    return [];
  }

  private calcPlayers(arr: IRoomState[]): number {
    return Array.isArray(arr)
      ? arr.reduce((acc, v) => acc + v.players.length, 0)
      : 0;
  }
}
