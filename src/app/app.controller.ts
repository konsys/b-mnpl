import { Controller, Get } from '@nestjs/common';
import { boardFields } from 'src/entities/fields';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // const fields =
    return JSON.stringify(boardFields);
  }
}
