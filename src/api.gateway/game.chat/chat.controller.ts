import {
  Controller,
  Post,
  Request,
  Inject,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MsNames, MsChatPatterns } from 'src/types/ms/ms.types';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IChatMessage } from 'src/types/game/game.types';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(MsNames.CHAT)
    private readonly proxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addChatMessage(@Request() req, @Body('message') message: string) {
    const el: IChatMessage = {
      message,
      name: req.user.username,
      toName: req.user.username,
      vip: true,
      toVip: true,
      time: new Date(),
    };

    try {
      const res = await this.proxy
        .send<any>({ cmd: MsChatPatterns.ADD_MESSAGE }, el)
        .toPromise();
      return res;
    } catch (err) {
      // TODO Logging
    }
  }
}
