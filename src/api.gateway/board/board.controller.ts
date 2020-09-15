import {
  Controller,
  Header,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IGameActionRequest } from 'src/types/board/board.types';
import { MsNames } from 'src/types/ms/ms.types';
import { ClientProxy } from '@nestjs/microservices';

@Controller('board')
export class BoardController {
  constructor(
    @Inject(MsNames.ACTIONS)
    private readonly proxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(
    @Request() req,
    @Body('data') data: IGameActionRequest,
  ): Promise<string> {
    const userId = req.user.userId;

    try {
      const res = await this.proxy
        .send<any>({ cmd: data.action }, data)
        .toPromise();
      return JSON.stringify({ code: 0 });
    } catch (err) {
      throw new BadRequestException(`Action not found ${err}`);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('surrender')
  @Header('Cache-Control', 'none')
  async surrender(@Body() { roomId, userId }): Promise<boolean> {
    console.log(roomId, userId);
    // try {
    //   const room = await this.proxy
    //     .send<any>({ cmd: MsRoomsPatterns.GET_ROOM }, roomId)
    //     .toPromise();
    //   return room;
    // } catch (e) {
    //   throw new UnprocessableEntityException(e);
    // }
    return true;
  }
}
