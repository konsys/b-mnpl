import { Controller } from '@nestjs/common';
import { IChatMessage } from 'src/types/game/game.types';
import { MessagePattern } from '@nestjs/microservices';
import { MsChatPatterns } from 'src/types/ms/ms.types';
import { chatRedis } from 'src/main';

enum ChatName {
  CHAT = 'chat',
}
@Controller('ms.chat')
export class ChatMsController {
  @MessagePattern({ cmd: MsChatPatterns.ADD_MESSAGE })
  async addMessage(): Promise<IChatMessage[]> {
    const messages = JSON.parse(await chatRedis.get(ChatName.CHAT));
    await chatRedis.set(ChatName.CHAT, JSON.stringify(messages.push('dddfw')));
    return JSON.parse(await chatRedis.get(ChatName.CHAT));
  }

  @MessagePattern({ cmd: MsChatPatterns.GET_ALL_MESSAGES })
  async getMessages(): Promise<IChatMessage[]> {
    return JSON.parse(await chatRedis.get(ChatName.CHAT));
  }
}
