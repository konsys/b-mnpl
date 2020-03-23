import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardField } from 'src/entities/board.field.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(BoardField)
    private readonly boardField: Repository<BoardField>,
  ) {}

  async findAll(): Promise<BoardField[]> {
    return await this.boardField.find();
    // return Promise.reWsolve(['d']);
  }
}
