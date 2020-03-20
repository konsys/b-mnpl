import { Controller, Get } from '@nestjs/common';
import { boardFields } from 'src/entities/fields';

@Controller('field')
export class FieldController {
  @Get()
  async getHello(): Promise<string> {
    console.log(2424243234);
    // const fields = await this.appService.findAll();
    return JSON.stringify(boardFields);
  }
}
