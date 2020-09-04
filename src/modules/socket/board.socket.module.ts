import { BoardSocket } from './board.socket';
import { GameSocket } from './game.socket';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [BoardSocket, GameSocket],
  controllers: [],
})
export class BoardSocketModule {}
