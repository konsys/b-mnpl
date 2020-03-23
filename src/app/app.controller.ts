import { Controller, Get } from '@nestjs/common';
import { boardFields } from 'src/entities/fields';

@Controller()
export class AppController {
  @Get()
  async getHello(): Promise<string> {
    return JSON.stringify(boardFields);
  }
}
