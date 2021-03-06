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
import { RequestWithUser } from '../../types/board/board.types';
import { ErrorCode } from 'src/utils/error.code';

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
    @Request() req: RequestWithUser,
    @Body('data') data: IGameActionRequest,
  ): Promise<string> {
    try {
      await this.proxy
        .send<any>({ cmd: data.action }, { userId: req.user.userId, ...data })
        .toPromise();
      //TODO add error handlers
      return JSON.stringify({ code: 0 });
    } catch (err) {
      throw new BadRequestException(ErrorCode.ActionNotFound);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('surrender')
  @Header('Cache-Control', 'none')
  async surrender(
    @Body() { roomId, userId }: { roomId: string; userId: number },
  ): Promise<IReturnCode> {
    const res = await this.proxy
      .send<any>({ cmd: MsRoomsPatterns.PLAYER_SURRENDER }, { roomId, userId })
      .toPromise();

    return res;
  }
}
