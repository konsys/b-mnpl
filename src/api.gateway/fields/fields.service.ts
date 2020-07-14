import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindManyOptions } from 'typeorm';
import { MsPatterns, MsNames } from 'src/types/MS/ms.types';
import { fieldsForSave } from 'src/entities/dbData';
import {
  IField,
  IMoneyTransaction,
  IPlayer,
  IFieldAction,
} from 'src/types/Board/board.types';
import { UsersService } from '../users/users.service';
import { dicesStore } from 'src/stores/dices.store';
import { redis } from 'src/main';
import { IFieldsStore } from 'src/stores/fields.store';
import _ from 'lodash';
import { FieldType } from 'src/entities/board.fields.entity';
import { ChecksService } from 'src/checks/checks.service';
import { BOARD_PARAMS } from 'src/params/board.params';
import { nanoid } from 'nanoid';

@Controller()
export class FieldsService {
  private logger: Logger = new Logger('FieldsService');
  constructor(
    @Inject(MsNames.FIELDS)
    private readonly fieldsClient: ClientProxy,
    private readonly usersService: UsersService,
    private readonly checksService: ChecksService,
  ) {}

  async getInitialFields(filter?: FindManyOptions) {
    try {
      const res = await this.fieldsClient
        .send<any>({ cmd: MsPatterns.GET_INIT_FIELDS }, filter || {})
        .toPromise();

      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async saveFields() {
    try {
      const fields = fieldsForSave();

      const res = await this.fieldsClient
        .send<any>({ cmd: MsPatterns.SAVE_FIELDS }, fields)
        .toPromise();
      return res;
    } catch (err) {
      this.logger.log(`Error: ${err}`);
    }
  }

  async findFieldByPosition(gameId: string, fieldPosition: number) {
    return (await this.getFieldsStore(gameId)).fields.find(
      (v) => v.fieldPosition === fieldPosition,
    );
  }

  async getActingField(gameId: string): Promise<IField> {
    const user = await this.usersService.getActingPlayer(gameId);
    const field = this.findFieldByPosition(gameId, user.meanPosition);
    if (!field) throw Error(`Field not found: position: ${user.meanPosition}`);
    return field;
  }

  async getFieldById(gameId: string, fieldId: number) {
    return (await this.getFieldsStore(gameId)).fields.find(
      (v) => v.fieldId === fieldId,
    );
  }

  async getFieldIndexById(gameId: string, fieldId: number) {
    return (await this.getFieldsStore(gameId)).fields.findIndex(
      (v) => v.fieldId === fieldId,
    );
  }

  async getBoughtFields(gameId: string) {
    return (await this.getFieldsStore(gameId)).fields
      .filter((v) => v.status && v.status.userId > 0)
      .map((v) => v.status);
  }

  async moneyTransactionParams(gameId: string): Promise<IMoneyTransaction> {
    const field = await this.getActingField(gameId);
    const p = await this.usersService.getActingPlayer(gameId);
    return {
      sum: -field.price,
      userId: p.userId,
      toUserId: (field.status && field.status.userId) || 0,
    };
  }

  async getFieldIndex(gameId: string, field: IField): Promise<number> {
    return (await this.getFieldsStore(gameId)).fields.findIndex(
      (v: any) => v.fieldId === field.fieldId,
    );
  }

  async updateField(gameId: string, field: IField) {
    const fields = (await this.getFieldsStore(gameId)).fields;

    fields[await this.getFieldIndex(gameId, field)] = field;
    this.updateAllFields(gameId, fields);
  }

  async updateAllFields(gameId: string, fields: IField[]) {
    const version = (await this.getFieldsStore(gameId)).version + 1;
    this.setFieldsStore(gameId, {
      version,
      fields,
    });
  }

  async getFieldRent(gameId: string, field: IField): Promise<number> {
    if (field && field.rent && field.rent.paymentMultiplier) {
      const group = await this.getPlayerGroupFields(
        gameId,
        field,
        await this.usersService.getPlayerById(gameId, field.status.userId),
      );
      const dices = dicesStore.getState();
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
    return (await this.getFieldsStore(gameId)).fields.filter(
      (v) =>
        v.fieldGroup === field.fieldGroup &&
        v.status &&
        v.status.userId === player.userId,
    );
  }

  async getFieldsByGroup(gameId: string, group: number): Promise<IField[]> {
    return (await this.getFieldsStore(gameId)).fields.filter(
      (v: IField) => v.fieldGroup === group,
    );
  }

  async getNotMortgagedFieldsByGroup(
    gameId: string,
    group: number,
    user: IPlayer,
  ) {
    (await this.getFieldsStore(gameId)).fields.filter(
      (v: IField) =>
        v.fieldGroup === group &&
        v.status &&
        v.status.mortgaged === 0 &&
        user.userId === v.status.userId,
    );
  }

  async buyCompany(gameId: string, f: IField): Promise<number> {
    const p = await this.usersService.getActingPlayer(gameId);
    const sameGroup = _.concat(
      await this.getPlayerGroupFields(gameId, f, p),
      f,
    );

    if (this.checksService.canBuyField(gameId, f.fieldId, p)) {
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
          fieldActions: this.getFieldActions(gameId, v.fieldId),
        };
        await this.updateField(gameId, v);
      }
    }
    return f.price.startPrice;
  }

  async mortgage(gameId: string, fieldId: number): Promise<void> {
    const f = await this.getFieldById(gameId, fieldId);
    const p = await this.usersService.getActingPlayer(gameId);

    await this.usersService.setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.MORTGAGE,
    });

    (await this.checksService.canMortgage(gameId, f.fieldId)) &&
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
    await setTransaction(gameId, {
      sum: f.price.pledgePrice,
      reason: `Money for pledge ${f.name}`,
      toUserId: p.userId,
      transactionId,
      userId: BOARD_PARAMS.BANK_PLAYER_ID,
    });
    await transactMoney(gameId, transactionId);
  }

  async mortgageNextRound(gameId: string) {
    const fields = (await this.getFieldsStore(gameId)).fields;
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

  async getFieldActions(gameId: string, fieldId: number): IFieldAction[] {
    if (canMortgage(fieldId) && canLevelUp(fieldId)) {
      return [IFieldAction.MORTGAGE, IFieldAction.LEVEL_UP];
    } else if (canUnMortgage(fieldId)) {
      return [IFieldAction.UNMORTGAGE];
    } else if (canLevelUp(fieldId) && canLevelDown(fieldId)) {
      return [IFieldAction.LEVEL_UP, IFieldAction.LEVEL_DOWN];
    } else if (canLevelDown(fieldId)) {
      return [IFieldAction.LEVEL_DOWN];
    } else if (canMortgage(fieldId)) {
      return [IFieldAction.MORTGAGE];
    } else if (canLevelUp(fieldId)) {
      return [IFieldAction.LEVEL_UP];
    }

    return [];
  }

  async unMortgage(gameId: string, fieldId: number): Promise<void> {
    const f = this.getFieldById(gameId, fieldId);
    const p = await this.usersService.getActingPlayer(gameId);

    setPlayerActionEvent(gameId, {
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.UNMORTGAGE,
    });

    canUnMortgage(f.fieldId) &&
      updateField({
        ...f,
        status: { ...f.status, mortgaged: 0 },
      });

    const groupFields = getPlayerGroupFields(f, p);
    groupFields.map((v) => {
      v.status = {
        ...v.status,
        fieldActions: getFieldActions(v.fieldId),
      };

      updateField(v);
    });

    const transactionId = nanoid(4);
    await setTransaction(gameId, {
      sum: f.price.buyoutPrice,
      reason: `Unmortgage field ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await transactMoney(gameId, transactionId);
  }

  async levelUpField(gameId: string, fieldId: number): Promise<void> {
    const f = this.getFieldById(fieldId);
    const p = await this.usersService.getActingPlayer(gameId);

    setPlayerActionEvent({
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.LEVEL_UP,
    });
    updateField({
      ...f,
      status: {
        ...f.status,
        branches: ++f.status.branches,
      },
    });
    const group = getFieldsByGroup(f.fieldGroup);
    group.map((v) => {
      v.status = {
        ...v.status,
        fieldActions: getFieldActions(v.fieldId),
      };
      updateField(v);
    });

    const transactionId = nanoid(4);
    await setTransaction(gameId, {
      sum: f.price.branchPrice,
      reason: `Buy branch ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    await transactMoney(gameId, transactionId);
  }

  async levelDownField(gameId: string, fieldId: number): Promise<void> {
    const f = this.getFieldById(fieldId);
    const p = await this.usersService.getActingPlayer(gameId);

    setPlayerActionEvent({
      userId: p.userId,
      fieldGroup: f.fieldGroup,
      fieldId: f.fieldId,
      fieldAction: IFieldAction.LEVEL_DOWN,
    });

    canLevelDown(f.fieldId) &&
      updateField({
        ...f,
        status: {
          ...f.status,
          branches: f.status.branches > 0 ? --f.status.branches : 0,
        },
      });
    const group = getFieldsByGroup(f.fieldGroup);
    group.map((v) => {
      v.status = {
        ...v.status,
        fieldActions: getFieldActions(v.fieldId),
      };
      updateField(v);
    });

    const transactionId = nanoid(4);
    await setTransaction(gameId, {
      sum: f.price.branchPrice,
      reason: `Buy branch ${f.name}`,
      toUserId: BOARD_PARAMS.BANK_PLAYER_ID,
      transactionId,
      userId: p.userId,
    });
    transactMoney(gameId, transactionId);
  }

  async setFieldsStore(gameId: string, fields: IFieldsStore) {
    await redis.set(`${gameId}-fields`, JSON.stringify(fields));
  }

  async getFieldsStore(gameId: string): Promise<IFieldsStore> {
    return JSON.parse(await redis.get(`${gameId}-fields`)) as IFieldsStore;
  }
}
