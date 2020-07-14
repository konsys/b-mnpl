import { Injectable } from '@nestjs/common';
import { BoardMessage } from 'src/types/Board/board.types';
import { IBoardEvent } from 'src/types/Board/board.types';
import { actionTypeToEventAdapter } from 'src/socket.messages/outcome.messages';
import { UsersService } from '../users/users.service';
import { FieldsService } from '../fields/fields.service';
import { ActionService } from '../action/action.service';

@Injectable()
export class BoardMessageService {
  constructor(
    private readonly usersClient: UsersService,
    private readonly fieldsClient: FieldsService,
    private readonly actionService: ActionService,
  ) {}

  async createBoardMessage(): Promise<BoardMessage> {
    const actionState = await this.actionService.getActionStore('kkk');

    let event: IBoardEvent = {
      // Adapt from actionStore to send to client
      action: actionState && actionTypeToEventAdapter(actionState.action),
    };
    const players = await this.usersClient.getPlayersStore('kkk');

    const message: BoardMessage = {
      code: 0,
      data: {
        id: (actionState && actionState.moveId) || 0,
        event,
        boardStatus: {
          players: players.players,
          fields: await this.fieldsClient.getBoughtFields('kkk'),
        },
      },
    };

    return message;
  }
}
