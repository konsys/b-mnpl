import { Controller, Get, Post } from '@nestjs/common';
import { fieldsForSave } from 'src/entities/dbData';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {
  constructor(private fieldsService: FieldsService) {}

  @Get('initial')
  async getFields(): Promise<string> {
    const fields = await this.fieldsService.findInit();
    return JSON.stringify(fields);
  }

  @Get('level')
  async getLevelFields(): Promise<string> {
    const fields = await this.fieldsService.findByLevel(1);
    return JSON.stringify(fields);
  }

  @Post()
  async saveFields(): Promise<string> {
    const res = await this.fieldsService.saveFields(fieldsForSave);
    return JSON.stringify(res);
  }
}
