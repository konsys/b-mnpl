import { Controller, Get, Inject } from '@nestjs/common';
import { MsNames, MsPatterns } from 'src/types/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';

enum FieldsPaths {
  initial = 'initial',
}
@Controller(MsNames.fields)
export class FieldsController {
  constructor(
    @Inject(MsNames.fields)
    private readonly client: ClientProxy,
  ) {}

  @Get()
  async sdf() {
    return [1, 2, 3, 4, 5];
  }

  @Get(FieldsPaths.initial)
  async getFields(): Promise<string> {
    const filter: FindManyOptions = { take: 2 };

    return await this.client
      .send<any>({ cmd: MsPatterns.getInitFields }, filter)
      .toPromise();
  }
}
