import { Controller } from '@nestjs/common';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MsPatterns } from 'src/types/ms.types';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FieldsMsController {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly service: Repository<BoardFieldsEntity>,
  ) {}

  @MessagePattern({ cmd: MsPatterns.GET_INIT_FIELDS })
  async getFields(): Promise<BoardFieldsEntity[]> {
    return await this.service.find();
  }

  @MessagePattern({ cmd: MsPatterns.SAVE_FIELDS })
  async saveFields(fields: BoardFieldsEntity[]): Promise<BoardFieldsEntity[]> {
    await this.service.save(fields);
    return await this.service.find();
  }
}
