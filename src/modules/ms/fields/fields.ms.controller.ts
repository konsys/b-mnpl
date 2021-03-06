import { Controller } from '@nestjs/common';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MsFieldsPatterns } from 'src/types/ms/ms.types';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ErrorCode } from 'src/utils/error.code';

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
    } catch (err) {}

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

  @MessagePattern({ cmd: MsFieldsPatterns.GET_FIELDS_BY_IDS })
  async getFieldsByIds(fieldIds: number[]): Promise<BoardFieldsEntity[]> {
    const where = fieldIds.map((fieldId) => ({ fieldId }));
    if (!where || !where.length) {
      return [];
    }
    return await this.fieldsRepository.find({ where });
  }
}
