import {
  Controller,
  Post,
  Request,
  Inject,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MsNames,
  MsChatPatterns,
  MsUsersPatterns,
} from 'src/types/ms/ms.types';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IChatMessage, SocketActions } from 'src/types/game/game.types';
import { redis } from 'src/main';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(MsNames.USERS)
    private readonly proxyUsers: ClientProxy,
    @Inject(MsNames.CHAT)
    private readonly proxy: ClientProxy,
  ) {}

  @Get()
  async getChatMessages() {
    try {
      const messages = JSON.stringify(
        await this.proxy
          .send<any>({ cmd: MsChatPatterns.GET_ALL_MESSAGES }, {})
          .toPromise(),
      );
      return messages;
    } catch (err) {
      // TODO Logging
    }
  }

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
    try {
      const chatMessages = await this.proxy
        .send<any>({ cmd: MsChatPatterns.ADD_MESSAGE }, el)
        .toPromise();

      await redis.publish(
        `${SocketActions.GAME_CHAT_MESSAGE}`,
        JSON.stringify(chatMessages),
      );

      return chatMessages;
    } catch (err) {
      // TODO Logging
    }
  }
}
