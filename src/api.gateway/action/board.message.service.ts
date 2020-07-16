import { Injectable } from '@nestjs/common';
import { BoardMessage } from 'src/types/Board/board.types';
import { IBoardEvent } from 'src/types/Board/board.types';
import { FieldsService } from '../fields/fields.service';
import { StoreService } from './store.service';
import { OutcomeMessageService } from './outcome-message.service';

@Injectable()
export class BoardMessageService {
  constructor(
    private readonly fieldsClient: FieldsService,
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
        id: (actionState && actionState.moveId) || 0,
        event,
        boardStatus: {
          players: players.players,
          fields: await this.fieldsClient.getBoughtFields(gameId),
        },
      },
    };

    return message;
  }
}
