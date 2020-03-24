import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardFieldEntity } from 'src/entities/board.field.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(BoardFieldEntity)
    private readonly boardField: Repository<BoardFieldEntity>,
  ) {}

  async findAll(): Promise<BoardFieldEntity[]> {
    return await this.boardField.find();
    // return Promise.reWsolve(['d']);
  }
}
