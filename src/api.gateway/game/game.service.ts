import { Injectable, Inject } from '@nestjs/common';
import { MsNames } from 'src/types/ms/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import { IGameActionRequest } from 'src/types/board/board.types';

@Injectable()
export class GameService {
  constructor(
    @Inject(MsNames.ACTIONS)
    private readonly proxy: ClientProxy,
  ) {}

  async sendToMS(data: IGameActionRequest): Promise<any> {
    const res = await this.proxy
      .send<any>({ cmd: data.action }, data)
      .toPromise();

    return res;
  }
}
