import { Controller, Get, Post } from '@nestjs/common';
import { fieldsForSave } from 'src/entities/dbData';
import { FieldService } from './field.service';

@Controller('board-fields')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Get('initial')
  async getFields(): Promise<string> {
    const fields = await this.fieldService.findInit();
    return JSON.stringify(fields);
  }

  @Get('level')
  async getLevelFields(): Promise<string> {
    const fields = await this.fieldService.findByLevel(1);
    return JSON.stringify(fields);
  }

  @Post()
  async saveFields(): Promise<string> {
    const res = await this.fieldService.saveFields(fieldsForSave);
    return JSON.stringify(res);
  }
}
