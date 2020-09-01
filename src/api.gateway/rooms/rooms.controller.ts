import { Controller, Post } from '@nestjs/common';

@Controller('rooms')
export class RoomsController {
  constructor() {}

  @Post()
  async createRoom(): Promise<string> {
    return 'createRoom';
  }
}
