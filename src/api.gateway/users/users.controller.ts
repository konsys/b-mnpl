import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MsNames } from 'src/types/MS/ms.types';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import { playersStore } from 'src/stores/players.store';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { BOARD_PARAMS } from 'src/params/board.params';
import { updateAction } from 'src/stores/actions.store';
import { OutcomeMessageType } from 'src/types/Board/board.types';
import { nanoid } from 'nanoid';
import { updateAllPLayers } from 'src/utils/users.utils';

@Controller(MsNames.USERS)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const res = await this.service.getUser(req.user.userId);
    return new UsersEntity(res);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async get(@Query() ids): Promise<UsersEntity[]> {
    let players = await this.service.getUsersByIds(ids.ids);

    const resultPlayers = [];
    if (players.length > 0) {
      // Случайная очередь ходов
      const ids = players.map((v) => v.userId).sort(() => Math.random() - 0.5);

      // Заполняем статус
      players = players.map((v, k) => {
        v = new UsersEntity(v);
        return {
          ...v,
          gameId: 'gameId',
          doublesRolledAsCombo: 0,
          jailed: 0,
          unjailAttempts: 0,
          meanPosition: 0,
          money: BOARD_PARAMS.INIT_MONEY,
          creditPayRound: false,
          creditNextTakeRound: 0,
          score: 0,
          timeReduceLevel: 0,
          creditToPay: 0,
          frags: '',
          additionalTime: 0,
          canUseCredit: v.vip,
          moveOrder: ids.findIndex((id) => id === v.userId),
          isActing: ids[0] === v.userId,
          movesLeft: 0,
        };
      });

      // Заполняем массив в порядке очереди ходов
      ids.map((id) => {
        resultPlayers.push(players.find((v) => v.userId === id));
      });

      updateAction({
        action: OutcomeMessageType.OUTCOME_ROLL_DICES_MODAL,
        userId: resultPlayers.find((v) => v.moveOrder === 0).userId,
        moveId: 0,
        actionId: nanoid(4),
      });
    }

    const id = nanoid();
    updateAllPLayers(id, resultPlayers);
    return playersStore.getState()[id];
  }

  @Post()
  async post(): Promise<UsersEntity[]> {
    return this.service.saveUsers();
  }
}
