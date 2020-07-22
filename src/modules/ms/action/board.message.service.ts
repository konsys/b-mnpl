import { BoardMessage } from 'src/types/board/board.types';
import { FieldsUtilsService } from './fields.utils.service';
import { IBoardEvent } from 'src/types/board/board.types';
import { Injectable } from '@nestjs/common';
import { OutcomeMessageService } from './outcome-message.service';
import { StoreService } from './store.service';

@Injectable()
export class BoardMessageService {
  constructor(
    private readonly fields: FieldsUtilsService,
    private readonly store: StoreService,
    private readonly outcomeMessage: OutcomeMessageService,
  ) {}

  async createBoardMessage(gameId: string): Promise<BoardMessage> {
    const actionState = await this.store.getActionStore(gameId);
    let event: IBoardEvent = {
      // Adapt from actionStore to send to client
      action:
        actionState &&
        (await this.outcomeMessage.actionTypeToEventAdapter(
          gameId,
          actionState.action,
        )),
    };
    const players = await this.store.getPlayersStore(gameId);

    const message: BoardMessage = {
      code: 0,
      data: {
        id: 0,
        event,
        boardStatus: {
          players: players ? players.players : [],
          fields: await this.fields.getBoughtFields(gameId),
        },
      },
    };

    return message;
  }
}
