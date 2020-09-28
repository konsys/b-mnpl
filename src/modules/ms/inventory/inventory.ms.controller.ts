import { BoardFieldsEntity } from 'src/entities/board.fields.entity';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsInventoryPatterns } from 'src/types/ms/ms.types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('rooms.ms')
export class InventoryMsController {
  constructor(
    @InjectRepository(BoardFieldsEntity)
    private readonly fieldsRepository: Repository<BoardFieldsEntity>,
  ) {}

  @MessagePattern({ cmd: MsInventoryPatterns.GET_USER_FIELDS })
  async getRoom({ userId }: { userId: number }): Promise<any> {
    const user = await this.fieldsRepository.findOne(userId);
    return 1;
  }
}
