import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Field } from 'src/entities/field.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async findAll(): Promise<Field[]> {
    return this.fieldRepository.find();
    // return Promise.reWsolve(['d']);
  }
}
