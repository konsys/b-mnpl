import { Controller } from '@nestjs/common';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MsPatterns } from 'src/types/ms/ms.types';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FieldsMsController {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly fieldsRepository: Repository<BoardFieldsEntity>,
  ) {}

  @MessagePattern({ cmd: MsPatterns.GET_INIT_FIELDS })
  async getFields(): Promise<any[]> {
    return await this.fieldsRepository.find();
  }

  @MessagePattern({ cmd: MsPatterns.SAVE_FIELDS })
  async saveFields(fields: BoardFieldsEntity[]): Promise<BoardFieldsEntity[]> {
    await this.fieldsRepository.save(fields);
    return await this.fieldsRepository.find();
  }
}
