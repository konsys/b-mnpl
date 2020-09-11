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
import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IGameActionRequest } from 'src/types/board/board.types';

@Controller('game')
export class GamesController {
  constructor(private readonly service: GamesService) {}

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
      const res = await this.service.sendToMS({ ...data, userId });
      return JSON.stringify({ code: 0 });
    } catch (err) {
      throw new BadRequestException(`Action not found ${err}`);
    }
  }
}
