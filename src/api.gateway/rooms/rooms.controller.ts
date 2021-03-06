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
  NotFoundException,
} from '@nestjs/common';
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import {
  IRoomState,
  IPlayerRoom,
  IRoomResponce,
} from 'src/types/game/game.types';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ErrorCode } from 'src/utils/error.code';
import { RequestWithUser } from 'src/types/board/board.types';

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
  async getRoom(@Param() roomId: string): Promise<IRoomResponce> {
    try {
      const room = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.GET_ROOM }, roomId)
        .toPromise();

      if (!room) {
        throw new NotFoundException({ error: ErrorCode.RoomDoesntExist });
      }
      return room;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  // @UseGuards(JwtAuthGuard)
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
    @Request() req: RequestWithUser,
    @Body('room') room: IRoomState,
  ): Promise<IRoomResponce> {
    try {
      const userId = req.user.userId;

      if (!userId) {
        throw new UnprocessableEntityException({
          code: ErrorCode.UserDoesntExists,
        });
      }
      room.creatorId = userId;
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
    @Request() req: RequestWithUser,
    @Body('add') add: IPlayerRoom,
  ): Promise<IRoomResponce> {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new UnprocessableEntityException({
          code: ErrorCode.UserDoesntExists,
        });
      }
      add.userId = userId;
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
