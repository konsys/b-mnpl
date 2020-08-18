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
  async addMessage(message: IChatMessage): Promise<IChatMessage[]> {
    let messages = JSON.parse(await chatRedis.get(ChatName.CHAT));
    messages = !Array.isArray(messages) ? [] : messages;
    console.log(1111, messages);
    await chatRedis.set(ChatName.CHAT, JSON.stringify(messages.push(message)));
    return JSON.parse(await chatRedis.get(ChatName.CHAT));
  }

  @MessagePattern({ cmd: MsChatPatterns.GET_ALL_MESSAGES })
  async getMessages(): Promise<IChatMessage[]> {
    return JSON.parse(await chatRedis.get(ChatName.CHAT));
  }
}
