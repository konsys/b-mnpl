import {
  Controller,
  Post,
  Inject,
  UseGuards,
  Body,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import {
  IRoomState,
  IAddPlayerToRoom,
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
}
