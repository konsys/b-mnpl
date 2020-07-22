import { Controller, Header, HttpCode, Post } from '@nestjs/common';

@Controller('game')
export class GameController {
  @Post('action')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  async action(): Promise<string> {
    return '1';
  }
}
