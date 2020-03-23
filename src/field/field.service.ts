import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FieldEntity } from 'src/entities/field.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
  ) {}

  async findAll(): Promise<FieldEntity[]> {
    return await this.fieldRepository.find();
    // return Promise.reWsolve(['d']);
  }
}
