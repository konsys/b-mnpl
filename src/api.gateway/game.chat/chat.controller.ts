import { Controller, Post, Request, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsNames, MsChatPatterns } from 'src/types/ms/ms.types';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(MsNames.CHAT)
    private readonly proxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addChatMessage(@Request() req) {
    try {
      const res = await this.proxy
        .send<any>({ cmd: MsChatPatterns.ADD_MESSAGE }, {})
        .toPromise();
      return res;
    } catch (err) {
      // TODO Logging
    }
  }
}
