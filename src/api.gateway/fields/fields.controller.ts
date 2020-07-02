import { Controller, Get, Post } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { FieldsService } from './fields.service';

enum FieldsPaths {
  initial = 'initial',
}
@Controller(MsNames.FIELDS)
export class FieldsController {
  constructor(private readonly fieldsServices: FieldsService) {}

  @Get(FieldsPaths.initial)
  async getFields(): Promise<string> {
    return await this.fieldsServices.getInitialFields();
  }

  @Post()
  async saveFields(): Promise<string> {
    return await this.fieldsServices.saveFields();
  }
}
