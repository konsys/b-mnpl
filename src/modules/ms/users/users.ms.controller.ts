import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('init')
export class UsersMsController {
  // constructor(
  //   @InjectRepository(UsersEntity)
  //   private readonly users: Repository<UsersEntity>,
  // ) {}

  // @MessagePattern({ cmd: 'users' })
  async findAll(): Promise<any> {
    return Promise.resolve(12);
    //   return await this.users.find({ take: 2 });
  }

  @Get()
  getAll() {
    return 12345;
  }
}
