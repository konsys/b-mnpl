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
import {
  IChatMessage,
  IGameSocketMessage,
  IGameMessageType,
} from 'src/types/game/game.types';
import { redis } from 'src/main';
import { BOARD_PARAMS } from 'src/params/board.params';

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
    try {
      const chatMessages = await this.proxy
        .send<any>({ cmd: MsChatPatterns.ADD_MESSAGE }, el)
        .toPromise();

      const message: IGameSocketMessage = {
        code: 0,
        chatMessages,
      };

      await redis.publish(
        `${BOARD_PARAMS.GAME_MESSAGE_CHANNEL}`,
        JSON.stringify(message),
      );

      return chatMessages;
    } catch (err) {
      // TODO Logging
    }
  }
}
