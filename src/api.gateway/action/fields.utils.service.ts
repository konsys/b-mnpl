import {
  IField,
  IFieldAction,
  IMoneyTransaction,
  IPlayer,
} from 'src/types/Board/board.types';

import { ActionService } from './action.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { ChecksService } from './checks.service';
import { FieldType } from 'src/entities/board.fields.entity';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from './store.service';
import { TransactionService } from './transaction.service';
import _, { isArray } from 'lodash';
import { nanoid } from 'nanoid';

@Injectable()
export class FieldsUtilsService {
  constructor(
    private readonly players: PlayersUtilsService,
    @Inject(forwardRef(() => ChecksService))
    private readonly checks: ChecksService,
    @Inject(forwardRef(() => ActionService))
    private readonly actionService: ActionService,
    private readonly transaction: TransactionService,
    private readonly store: StoreService,
  ) {}

  async findFieldByPosition(gameId: string, fieldPosition: number) {
    const fields = await this.getFields(gameId);
    return fields.find((v) => v.fieldPosition === fieldPosition);
  }

  async getActingField(gameId: string): Promise<IField> {
    const user = await this.players.getActingPlayer(gameId);

    const field = this.findFieldByPosition(gameId, user.meanPosition);
    if (!field) throw Error(`Field not found: position: ${user.meanPosition}`);
    return field;
  }

  async getFieldById(gameId: string, fieldId: number) {
    const fields = await this.getFields(gameId);
    return fields.find((v) => v.fieldId === fieldId);
  }

  async getFieldIndexById(gameId: string, fieldId: number) {
    const fields = await this.getFields(gameId);
    return fields.findIndex((v) => v.fieldId === fieldId);
  }

  async getBoughtFields(gameId: string) {
    const fields = await this.getFields(gameId);
    return fields
      .filter((v) => v.status && v.status.userId > 0)
      .map((v) => v.status);
  }

  async moneyTransactionParams(gameId: string): Promise<IMoneyTransaction> {
    const field = await this.getActingField(gameId);
    const p = await this.players.getActingPlayer(gameId);
    return {
      sum: -field.price,
      userId: p.userId,
      toUserId: (field.status && field.status.userId) || 0,
    };
  }

  async getFieldIndex(gameId: string, field: IField): Promise<number> {
    const fields = await this.getFields(gameId);
    return fields.findIndex((v: any) => v.fieldId === field.fieldId);
  }

  async updateField(gameId: string, field: IField) {
    const fields = await this.getFields(gameId);
    fields[await this.getFieldIndex(gameId, field)] = field;
    this.updateAllFields(gameId, fields);
  }

  async updateAllFields(gameId: string, fields: IField[]) {
    await this.store.setFieldsStore(gameId, {
      fields,
    });
  }

  async getFieldRent(gameId: string, field: IField): Promise<number> {
    if (field && field.rent && field.rent.paymentMultiplier) {
      const group = await this.getPlayerGroupFields(
        gameId,
        field,
        await this.players.getPlayerById(gameId, field.status.userId),
      );
      const dices = await this.store.getDicesStore(gameId);
      return (
        dices.sum *
        (group.length === 1 ? field.rent.baseRent : field.rent.oneStar)
      );
    }
    if (!field.status || field.status.branches === 0) {
      return field.rent.baseRent;
    }
    if (field.status) {
      if (field.status.branches === 1) {
        return field.rent.oneStar;
      }
      if (field.status.branches === 2) {
        return field.rent.twoStar;
      }
      if (field.status.branches === 3) {
        return field.rent.freeStar;
      }
      if (field.status.branches === 4) {
        return field.rent.fourStar;
      }
      if (field.status.branches === 5) {
        return field.rent.bigStar;
      }
    }

    return 0;
  }

  async getPlayerGroupFields(
    gameId: string,
    field: IField,
    player: IPlayer,
  ): Promise<IField[]> {
    const fields = await this.getFields(gameId);
    return fields.filter(
      (v) =>
        v.fieldGroup === field.fieldGroup &&
        v.status &&
        v.status.userId === player.userId,
    );
  }

  async getFieldsByGroup(gameId: string, group: number): Promise<IField[]> {
    const fields = await this.getFields(gameId);
    return fields.filter((v: IField) => v.fieldGroup === group);
  }

  async getNotMortgagedFieldsByGroup(
    gameId: string,
    group: number,
    user: IPlayer,
  ) {
    const fields = await this.getFields(gameId);
    fields.filter(
      (v: IField) =>
        v.fieldGroup === group &&
        v.status &&
        v.status.mortgaged === 0 &&
        user.userId === v.status.userId,
    );
  }

  async buyCompany(gameId: string, f: IField): Promise<number> {
    const p = await this.players.getActingPlayer(gameId);
    const sameGroup = _.concat(
      await this.getPlayerGroupFields(gameId, f, p),
      f,
    );

    if (this.checks.canBuyField(gameId, f.fieldId, p)) {
      this.updateField(gameId, {
        ...f,

        status: {
          fieldId: f.fieldId,
          userId: p.userId,
          branches: f.type === FieldType.COMPANY ? 0 : sameGroup.length - 1,
          mortgaged: f.status.mortgaged || 0,
          fieldActions: await this.getFieldActions(gameId, f.fieldId),
        },
      });

      for (const v of sameGroup) {
        // sameGroup.map((v: IField)  {
        v.status = {
          fieldId: v.fieldId,
          userId: p.userId,
          branches:
            f.type === FieldType.COMPANY
              ? v.status.branches || 0
              : sameGroup.length - 1,
          mortgaged: v.status.mortgaged || 0,
          fieldActions: await this.getFieldActions(gameId, v.fieldId),
        };
        await this.updateField(gameId, v);
      }
    }
    return f.price.startPrice;
  }

  async mortgage(gameId: string, fieldId: number): Promise<void> {
    const f = await this.getFieldById(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);

    await this.actionService.setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.MORTGAGE,
    });

    (await this.checks.canMortgage(gameId, f.fieldId)) &&
      (await this.updateField(gameId, {
        ...f,
        status: { ...f.status, mortgaged: BOARD_PARAMS.MORTGAGE_TURNS },
      }));

    const groupFields = await this.getPlayerGroupFields(gameId, f, p);
    for (const v of groupFields) {
      v.status = {
        ...v.status,
        fieldActions: await this.getFieldActions(gameId, v.fieldId),
      };

      await this.updateField(gameId, v);
    }

    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum: f.price.pledgePrice,
      reason: `Money for pledge ${f.name}`,
      toUserId: p.userId,
      transactionId,
      userId: BOARD_PARAMS.BANK_PLAYER_ID,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  async mortgageNextRound(gameId: string) {
    const fields = await this.getFields(gameId);

    const res = fields.map((v: IField) => {
      if (v.status && v.status.mortgaged > 1) {
        return {
          ...v,
          status: { ...v.status, mortgaged: --v.status.mortgaged },
        };
      } else if (v.status && v.status.mortgaged === 1) {
        v.status && delete v.status;
      }
      return v;
    });
    return res;
  }

  async getFieldActions(
    gameId: string,
    fieldId: number,
  ): Promise<IFieldAction[]> {
    if (
      (await this.checks.canMortgage(gameId, fieldId)) &&
      (await this.checks.canLevelUp(gameId, fieldId))
    ) {
      return [IFieldAction.MORTGAGE, IFieldAction.LEVEL_UP];
    } else if (await this.checks.canUnMortgage(gameId, fieldId)) {
      return [IFieldAction.UNMORTGAGE];
    } else if (
      (await this.checks.canLevelUp(gameId, fieldId)) &&
      (await this.checks.canLevelDown(gameId, fieldId))
    ) {
      return [IFieldAction.LEVEL_UP, IFieldAction.LEVEL_DOWN];
    } else if (await this.checks.canLevelDown(gameId, fieldId)) {
      return [IFieldAction.LEVEL_DOWN];
    } else if (await this.checks.canMortgage(gameId, fieldId)) {
      return [IFieldAction.MORTGAGE];
    } else if (await this.checks.canLevelUp(gameId, fieldId)) {
      return [IFieldAction.LEVEL_UP];
    }

    return [];
  }

  async unMortgage(gameId: string, fieldId: number): Promise<void> {
    const f = await this.getFieldById(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);

    await this.actionService.setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.UNMORTGAGE,
    });

    (await this.checks.canUnMortgage(gameId, f.fieldId)) &&
      (await this.updateField(gameId, {
        ...f,
        status: { ...f.status, mortgaged: 0 },
      }));

    const groupFields = await this.getPlayerGroupFields(gameId, f, p);
    for (const v of groupFields) {
      v.status = {
        ...v.status,
        fieldActions: await this.getFieldActions(gameId, v.fieldId),
      };

      await this.updateField(gameId, v);
    }

    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum: f.price.buyoutPrice,
      reason: `Unmortgage field ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  async levelUpField(gameId: string, fieldId: number): Promise<void> {
    const f = await this.getFieldById(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);

    await this.actionService.setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.LEVEL_UP,
    });
    await this.updateField(gameId, {
      ...f,
      status: {
        ...f.status,
        branches: ++f.status.branches,
      },
    });
    const group = await this.getFieldsByGroup(gameId, f.fieldGroup);
    for (const v of group) {
      v.status = {
        ...v.status,
        fieldActions: await this.getFieldActions(gameId, v.fieldId),
      };
      await this.updateField(gameId, v);
    }

    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum: f.price.branchPrice,
      reason: `Buy branch ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  async levelDownField(gameId: string, fieldId: number): Promise<void> {
    const f = await this.getFieldById(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);

    await this.actionService.setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.LEVEL_DOWN,
    });

    (await this.checks.canLevelDown(gameId, f.fieldId)) &&
      (await this.updateField(gameId, {
        ...f,
        status: {
          ...f.status,
          branches: f.status.branches > 0 ? --f.status.branches : 0,
        },
      }));
    const group = await this.getFieldsByGroup(gameId, f.fieldGroup);
    for (const v of group) {
      v.status = {
        ...v.status,
        fieldActions: await this.getFieldActions(gameId, v.fieldId),
      };
      await this.updateField(gameId, v);
    }

    const transactionId = nanoid(4);
    await this.store.setTransaction(gameId, {
      sum: f.price.branchPrice,
      reason: `Buy branch ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await this.transaction.transactMoney(gameId, transactionId);
  }

  private async getFields(gameId: string): Promise<IField[]> {
    const fields = await this.store.getFieldsStore(gameId);
    return isArray(fields) ? fields : [];
  }
}
