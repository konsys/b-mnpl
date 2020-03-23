import { Controller, Get, Post } from '@nestjs/common';
import { BoardField } from '../entities/board.field.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fieldsForSave } from '../entities/fields';

@Controller('boardField')
export class FieldController {
  constructor(
    @InjectRepository(BoardField)
    private fieldService: Repository<BoardField>,
  ) {}

  @Get('initial')
  async getFields(): Promise<string> {
    const fields = await this.fieldService.find({ level: 0 });
    return JSON.stringify(fields);
  }

  @Post()
  async saveFields(): Promise<string> {
    const res = await this.fieldService.save(fieldsForSave);
    return JSON.stringify(res);
  }
}
