import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async findAll(): Promise<Field[]> {
    return this.fieldRepository.find();
    // return Promise.reWsolve(['d']);
  }
}
