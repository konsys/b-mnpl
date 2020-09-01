import { Controller } from '@nestjs/common';
import { IChatMessage } from 'src/types/game/game.types';
import { MessagePattern } from '@nestjs/microservices';
import { MsChatPatterns } from 'src/types/ms/ms.types';
import { chatRedis } from 'src/main';

enum Chats {
  GAME_CHAT = 'gameChat',
}
@Controller('ms.chat')
export class ChatMsController {
  @MessagePattern({ cmd: MsChatPatterns.ADD_MESSAGE })
  async addMessage(message: IChatMessage): Promise<IChatMessage[]> {
    let messageString = await chatRedis.get(Chats.GAME_CHAT);

    try {
      messageString = JSON.parse(messageString);
    } catch (er) {
      //NOP
    }

    const messages = Array.isArray(messageString) ? messageString : [];

    messages.push(message);

    // await chatRedis.del(ChatName.CHAT);
    await chatRedis.set(Chats.GAME_CHAT, JSON.stringify(messages));
    // TODO add expire for chat
    await chatRedis.expire([Chats.GAME_CHAT, 5000]);
    return await chatRedis.get(Chats.GAME_CHAT);
  }

  @MessagePattern({ cmd: MsChatPatterns.GET_ALL_MESSAGES })
  async getMessages(): Promise<IChatMessage[]> {
    return JSON.parse(await chatRedis.get(Chats.GAME_CHAT));
  }
}
