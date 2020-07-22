import { Controller, Get, Post } from '@nestjs/common';

import { FieldsService } from './fields.service';
import { MsNames } from 'src/types/ms/ms.types';
// import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

enum FieldsPaths {
  initial = 'initial',
}
@Controller(MsNames.FIELDS)
export class FieldsController {
  constructor(private readonly fieldsServices: FieldsService) {}

  // @UseGuards(JwtAuthGuard)
  @Get(FieldsPaths.initial)
  async getFields(): Promise<string> {
    return await this.fieldsServices.getInitialFields();
  }

  @Post()
  async saveFields(): Promise<string> {
    return await this.fieldsServices.saveFields();
  }
}
