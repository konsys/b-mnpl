import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { FieldsService } from './fields.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

enum FieldsPaths {
  initial = 'initial',
}
@Controller(MsNames.FIELDS)
export class FieldsController {
  constructor(private readonly fieldsServices: FieldsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(FieldsPaths.initial)
  async getFields(): Promise<string> {
    return await this.fieldsServices.getInitialFields();
  }

  @Post()
  async saveFields(): Promise<string> {
    return await this.fieldsServices.saveFields();
  }
}
