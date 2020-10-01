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
import { MsNames, MsRoomsPatterns } from 'src/types/ms/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import { IReturnCode } from 'src/types/game/game.types';

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
    try {
      await this.proxy.send<any>({ cmd: data.action }, data).toPromise();
      //TODO add error handlers
      return JSON.stringify({ code: 0 });
    } catch (err) {
      throw new BadRequestException(`Action not found ${err}`);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('surrender')
  @Header('Cache-Control', 'none')
  async surrender(@Body() { roomId, userId }): Promise<IReturnCode> {
    const res = await this.proxy
      .send<any>({ cmd: MsRoomsPatterns.PLAYER_SURRENDER }, { roomId, userId })
      .toPromise();

    return res;
  }
}
