import { Controller, Get, Post, Inject } from '@nestjs/common';
import { MsNames, MsPatterns } from 'src/types/ms.types';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';

@Controller('fields')
export class FieldsController {
  constructor(
    @Inject(MsNames.fields)
    private readonly client: ClientProxy,
  ) {}

  @Get('initial')
  async getFields(): Promise<string> {
    const filter: FindManyOptions = { take: 2 };
    return await this.client
      .send<any>({ cmd: MsPatterns.getInitFields }, filter)
      .toPromise();
  }
}
