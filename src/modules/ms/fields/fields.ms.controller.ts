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

  @MessagePattern({ cmd: MsPatterns.getInitFields })
  async getFields(): Promise<BoardFieldsEntity[]> {
    return await this.service.find();
  }
}
