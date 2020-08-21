import {
  Controller,
  Post,
  Request,
  Inject,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MsNames,
  MsChatPatterns,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IChatMessage } from 'src/types/game/game.types';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly proxyUsers: ClientProxy,
    @Inject(MsNames.CHAT)
    private readonly proxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addChatMessage(
    @Request() req,
    @Body('message') message: string,
    @Body('replies') replies: any,
  ) {
    const fromUser = await this.proxy
      .send<any>({ cmd: MsUsersPatterns.GET_USER }, { userId: req.user.userId })
      .toPromise();

    const el: IChatMessage = {
      message,
      fromUser,
      replies,
      time: new Date(),
    };

    console.log(111111111, replies);
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
