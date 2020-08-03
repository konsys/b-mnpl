import { Controller } from '@nestjs/common';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MsFieldsPatterns } from 'src/types/ms/ms.types';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FieldsMsController {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly fieldsRepository: Repository<BoardFieldsEntity>,
  ) {}

  @MessagePattern({ cmd: MsFieldsPatterns.GET_INIT_FIELDS })
  async getFields(): Promise<any[]> {
    return await this.fieldsRepository.find();
  }

  @MessagePattern({ cmd: MsFieldsPatterns.SAVE_FIELDS })
  async saveFields(fields: BoardFieldsEntity[]): Promise<BoardFieldsEntity[]> {
    try {
      await this.fieldsRepository.delete('id > 0');
    } catch (err) {
      console.log(fields);
    }

    await this.fieldsRepository.save(fields);
    return await this.fieldsRepository.find();
  }

  @MessagePattern({ cmd: MsFieldsPatterns.UPDATE_FIELD })
  async updateField({
    fieldId,
    data,
  }: {
    fieldId: number;
    data: BoardFieldsEntity;
  }): Promise<BoardFieldsEntity> {
    try {
      await this.fieldsRepository.update(fieldId, data);
      return await this.fieldsRepository.findOne(fieldId);
    } catch (ex) {
      console.log(`Error while updating ${data.name} ${ex}`);
    }
  }
}
