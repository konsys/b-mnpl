import { BoardSocket } from './board.socket';
import { GameChatSocket } from './game.chat.socket';
import { Module } from '@nestjs/common';
import { RoomsSocket } from './rooms.socket';

@Module({
  imports: [],
  providers: [BoardSocket, GameChatSocket, RoomsSocket],
  controllers: [],
})
export class BoardSocketModule {}
