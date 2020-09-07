import {
  Controller,
  Post,
  Inject,
  UseGuards,
  Body,
  Request,
  UnprocessableEntityException,
  Get,
} from '@nestjs/common';
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import {
  IRoomState,
  IAddPlayerToRoom,
  IRoomResponce,
  SocketActions,
} from 'src/types/game/game.types';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { redis } from 'src/main';

@Controller('rooms')
export class RoomsController {
  constructor(
    @Inject(MsNames.ROOMS)
    private readonly proxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRooms(): Promise<IRoomResponce> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.GET_ROOMS }, {})
        .toPromise();
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(
    @Request() req,
    @Body('room') room: IRoomState,
  ): Promise<IRoomResponce> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.CREATE_ROOM }, { room })
        .toPromise();
      await redis.publish(
        `${SocketActions.ROOM_MESSAGE}`,
        JSON.stringify(rooms),
      );
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('addPlayer')
  async addPlayerToRoom(
    @Request() req,
    @Body('add') add: IAddPlayerToRoom,
  ): Promise<IRoomResponce> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.ADD_PLAYER }, { add })
        .toPromise();
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('removePlayer')
  async removePlayerFromRoom(
    @Body('remove') remove: IAddPlayerToRoom,
  ): Promise<IRoomResponce> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.REMOVE_PLAYER }, { remove })
        .toPromise();
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }
}
