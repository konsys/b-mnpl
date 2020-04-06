import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly boardField: Repository<BoardFieldsEntity>,
  ) {}

  async findInit(): Promise<BoardFieldsEntity[]> {
    return await this.boardField.find({ level: 0 });
  }

  async findByLevel(level: number): Promise<BoardFieldsEntity[]> {
    return await this.boardField.find({ level });
  }

  async saveFields(fields: BoardFieldsEntity[]): Promise<BoardFieldsEntity[]> {
    return await this.boardField.save(fields);
  }
}
