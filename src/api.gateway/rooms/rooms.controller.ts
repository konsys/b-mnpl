import {
  Controller,
  Post,
  Inject,
  UseGuards,
  Body,
  Request,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import { IRoomState } from 'src/types/game/game.types';
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
  ): Promise<IRoomState[]> {
    try {
      const rooms = await this.proxy
        .send<any>({ cmd: MsRoomsPatterns.CREATE_ROOM }, { room })
        .toPromise();
      return rooms;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }
}
