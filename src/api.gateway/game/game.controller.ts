import {
  Controller,
  Header,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { IncomeMessageType } from 'src/types/board/board.types';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IGameActionRequest } from 'src/types/board/board.types';

@Controller('game')
export class GameController {
  constructor(private readonly service: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(
    @Request() req,
    @Body('data') data: IGameActionRequest,
  ): Promise<string> {
    const userId = req.user.userId;

    const res = await this.service.sendToMS(data);

    return JSON.stringify({ code: 0 });
  }
}
