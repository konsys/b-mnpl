import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller('init')
export class UsersMsController {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  @MessagePattern({ cmd: 'ping' })
  async ping() {
    return of('pong').pipe(delay(1000));
  }
}
