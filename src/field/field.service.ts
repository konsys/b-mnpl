import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly boardField: Repository<BoardFieldsEntity>,
  ) {}

  async findAll(): Promise<BoardFieldsEntity[]> {
    return await this.boardField.find();
  }
}
