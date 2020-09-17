import {
  Controller,
  Post,
  Inject,
  UseGuards,
  Body,
  Request,
  UnprocessableEntityException,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import {
  IRoomState,
  IPlayerRoom,
  IRoomResponce,
} from 'src/types/game/game.types';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(
    @Inject(MsNames.ROOMS)
    private readonly proxy: ClientProxy,
  ) {}

  @Delete()
  async deleteRooms(): Promise<IRoomResponce> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.DELETE_ROOMS }, {})
        .toPromise();
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':roomId')
  async getRoom(@Param() roomId): Promise<IRoomResponce> {
    try {
      const room = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.GET_ROOM }, roomId)
        .toPromise();
      return room;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

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
      room.creatorId = req.user.userId;
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.CREATE_ROOM }, { room })
        .toPromise();

      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('addPlayer')
  async addPlayerToRoom(
    @Request() req,
    @Body('add') add: IPlayerRoom,
  ): Promise<IRoomResponce> {
    try {
      add.userId = req.user.userId;
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.ADD_PLAYER }, { add })
        .toPromise();
      return rooms;
    } catch (e) {
      console.log(121212, e);
      throw new UnprocessableEntityException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('removePlayer')
  async removePlayerFromRoom(
    @Body('remove') remove: IPlayerRoom,
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
