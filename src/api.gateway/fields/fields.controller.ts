import { Controller, Get } from '@nestjs/common';
import { MsNames } from 'src/types/ms.types';
import { FieldsService } from './fields.service';

enum FieldsPaths {
  initial = 'initial',
}
@Controller(MsNames.fields)
export class FieldsController {
  constructor(private readonly fieldsServices: FieldsService) {}

  @Get(FieldsPaths.initial)
  async getFields(): Promise<string> {
    return await this.fieldsServices.getInitialFields();
  }
}
