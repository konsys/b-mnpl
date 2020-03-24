import { Controller, Get } from '@nestjs/common';
import { fieldsForSave } from 'src/entities/dbData';

@Controller()
export class AppController {
  @Get()
  async getHello(): Promise<string> {
    return JSON.stringify(fieldsForSave);
  }
}
