import { Controller, Post, Inject } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { ClientProxy } from '@nestjs/microservices';

@Controller('rooms')
export class RoomsController {
  constructor(
    @Inject(MsNames.ROOMS)
    private readonly proxy: ClientProxy,
  ) {}

  @Post()
  async createRoom(): Promise<string> {
    return 'createRoom';
  }
}
