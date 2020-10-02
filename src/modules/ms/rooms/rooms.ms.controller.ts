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
  IReturnCode,
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
  ROOMS_KEY = 'room',
  ALL_ROOMS = 'allRooms',
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
  public async deleteAllRoooms() {
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
  public async playerSurrender(el: IPlayerRoom): Promise<IReturnCode> {
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
            await this.deleteRoom(room.roomId);
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
    try {
      let prevRoom = await this.get(id);
      prevRoom = prevRoom ? prevRoom : ({} as IRoomState);
      const value = { [Rooms.ROOMS_KEY]: { ...prevRoom, ...room } };

      await roomsRedis.set(id, JSON.stringify(value));

      await this.addToAllRoomsIds(id);
      await roomsRedis.expire([Rooms.ALL_ROOMS, 10000]);
      await roomsRedis.expire([id, 10000]);
    } catch (err) {
      // TODO loggin
      console.log('ERROR SET KEY', err);
    }

    return;
  }

  private async get(id: string): Promise<IRoomState | null> {
    try {
      let room = JSON.parse(await roomsRedis.get(id));

      const res = room[Rooms.ROOMS_KEY];

      return res;
    } catch (err) {
      try {
        await this.del(id);
      } catch (err) {}
    }

    return null;
  }

  private async del(id: string): Promise<IRoomState | null> {
    try {
      roomsRedis.del(id);
    } catch (err) {}

    return null;
  }

  private async deleteRoom(roomId: string): Promise<boolean> {
    try {
      let rooms = await this.getAllRooms();
      const room = await this.get(roomId);
      rooms = rooms.filter((v) => v.roomId !== roomId);
      await roomsRedis.set(Rooms.ALL_ROOMS, JSON.stringify(rooms));
      const players = room.players.map((v) => v.userId);
      for (const player of players) {
        await roomsRedis.del(player);
      }
      await this.del(roomId);
      return true;
    } catch (err) {}

    return false;
  }

  private async addToAllRoomsIds(id: string): Promise<any[]> {
    try {
      const re = await roomsRedis.get(Rooms.ALL_ROOMS);

      let roomIds = re ? JSON.parse(re) : [];
      let index = -1;
      if (re) {
        roomIds = JSON.parse(re);
        index = roomIds.findIndex((v) => v === id);
      }

      index < 0 && roomIds.push(id);

      await roomsRedis.set(Rooms.ALL_ROOMS, JSON.stringify(roomIds));

      return roomIds;
    } catch (err) {
      console.log('ERROR', err);
    }

    return [];
  }

  private async getAllRooms(): Promise<IRoomState[]> {
    try {
      const allRooms = [];
      const roomsIds = JSON.parse(await roomsRedis.get(Rooms.ALL_ROOMS));
      if (!Array.isArray(roomsIds)) {
        return [];
      }
      for (let roomId of roomsIds) {
        allRooms.push(
          JSON.parse(await roomsRedis.get(roomId))[Rooms.ROOMS_KEY],
        );
      }

      return allRooms;
    } catch (err) {
      console.log('ERROR', err);
    }

    return [];
  }

  private calcPlayers(arr: IRoomState[]): number {
    return Array.isArray(arr)
      ? arr.reduce((acc, v) => acc + v.players.length, 0)
      : 0;
  }
}
