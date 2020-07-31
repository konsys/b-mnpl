import {
  IField,
  IFieldAction,
  IPlayer,
  IContract,
} from 'src/types/board/board.types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { BOARD_PARAMS } from 'src/params/board.params';
import { FieldType } from 'src/entities/board.fields.entity';
import { FieldsUtilsService } from './fields.utils.service';
import { PlayersUtilsService } from './players.utils.service';
import { StoreService } from 'src/modules/ms/action/store.service';

@Injectable()
export class ChecksService {
  constructor(
    private readonly players: PlayersUtilsService,
    @Inject(forwardRef(() => FieldsUtilsService))
    private readonly fields: FieldsUtilsService,
    private readonly store: StoreService,
  ) {}

  async isTax(gameId: string, fieldId: number): Promise<boolean> {
    const f = await this.fields.getField(gameId, fieldId);

    return f.type === FieldType.TAX;
  }

  async isStartPass(userId: number): Promise<boolean> {
    const gameId = await this.players.getGameIdByPlayerId(userId);
    const dices = await this.store.getDicesStore(gameId);
    const player = await this.players.getActingPlayer(gameId);

    return dices && dices.sum > 0 && player.meanPosition - dices.sum < 0;
  }

  async isStart(gameId: string, fieldId: number): Promise<boolean> {
    return (
      (await this.fields.getField(gameId, fieldId)).type === FieldType.START
    );
  }
  async isJail(gameId: string, fieldId: number): Promise<boolean> {
    return (
      (await this.fields.getField(gameId, fieldId)).type === FieldType.JAIL
    );
  }

  async isFieldMortgaged(gameId: string, fieldId: number): Promise<boolean> {
    const field = await this.fields.getField(gameId, fieldId);
    return field && field.status && field.status.mortgaged > 0;
  }

  async isCompany(gameId: string, fieldId: number) {
    const type = (await this.fields.getField(gameId, fieldId)).type;

    return (
      type &&
      (type === FieldType.COMPANY ||
        type === FieldType.AUTO ||
        type === FieldType.IT)
    );
  }

  async isChance(gameId: string, fieldId: number): Promise<boolean> {
    return (
      (await this.fields.getField(gameId, fieldId)).type === FieldType.CHANCE
    );
  }

  async isCompanyForSale(gameId: string, fieldId: number): Promise<boolean> {
    const f = await this.fields.getField(gameId, fieldId);

    const isCompany = await this.isCompany(gameId, f.fieldId);

    return isCompany && f && !f.status;
  }

  async isMyField(userId: number, fieldId: number): Promise<boolean> {
    const gameId = await this.players.getGameIdByPlayerId(userId);
    const field = await this.fields.getField(gameId, fieldId);
    return (
      (await this.isCompany(gameId, fieldId)) &&
      field.status &&
      field.status.userId ===
        (await this.players.getActingPlayer(gameId)).userId
    );
  }

  async canBuyField(fieldId: number, p: IPlayer): Promise<boolean> {
    return (
      (await this.isCompany(p.gameId, fieldId)) &&
      (await this.fields.getField(p.gameId, fieldId)).price.startPrice <=
        p.money
    );
  }

  async whosField(gameId: string, fieldId: number): Promise<number> {
    const f = await this.fields.getField(gameId, fieldId);

    return (f.status && f.status.userId) || BOARD_PARAMS.BANK_PLAYER_ID;
  }

  async noActionField(gameId: string, fieldId: number): Promise<boolean> {
    const field = await this.fields.getField(gameId, fieldId);

    return (
      field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO
    );
  }

  async playerHasMonopoly(f: IField, p: IPlayer): Promise<boolean> {
    const sg = await this.fields.getPlayerGroupFields(f, p);
    const pg = await this.fields.getFieldsByGroup(p.gameId, f.fieldGroup);
    return sg.length === pg.length;
  }

  async isGroupMortgaged(gameId: string, f: IField): Promise<boolean> {
    const p = await this.players.getActingPlayer(gameId);
    const sg = await this.fields.getPlayerGroupFields(f, p);
    return sg.some((v) => v.status && v.status.mortgaged > 0);
  }

  async groupHasBranches(gameId: string, f: IField): Promise<boolean> {
    return (await this.fields.getFieldsByGroup(gameId, f.fieldGroup)).some(
      (v) => v.status && v.status.branches > 0,
    );
  }

  async canMortgage(gameId: string, fieldId: number): Promise<boolean> {
    if (!gameId || !fieldId) return false;

    const f = await this.fields.getField(gameId, fieldId);
    const hasBranches = await this.groupHasBranches(gameId, f);
    return (
      f &&
      (await this.isCompany(gameId, fieldId)) &&
      f.status &&
      f.status.mortgaged === 0 &&
      !hasBranches
    );
  }

  async canUnMortgage(gameId: string, fieldId: number): Promise<boolean> {
    if (!gameId || !fieldId) return false;
    const f = await this.fields.getField(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);
    return (
      f &&
      (await this.isCompany(gameId, fieldId)) &&
      f.status &&
      f.status.mortgaged > 0 &&
      f.status.userId === p.userId
    );
  }

  async canLevelUp(gameId: string, fieldId: number): Promise<boolean> {
    if (!gameId || !fieldId) return false;

    const f = await this.fields.getField(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);
    const m = await this.playerHasMonopoly(f, p);
    const isMortgaged = await this.isGroupMortgaged(gameId, f);

    const group = await this.fields.getFieldsByGroup(gameId, f.fieldGroup);
    const branches = group.map((v) => v.status.branches);
    const max = Math.max(...branches);
    const min = Math.min(...branches);
    const boardState = await this.store.getBoardStore(gameId);
    const alreadyUp = boardState.playerActions.some(
      (v) =>
        v.fieldGroup === f.fieldGroup &&
        v.fieldAction === IFieldAction.LEVEL_UP,
    );
    const byOrder = BOARD_PARAMS.BRANCHES.BUILD_QEUEU
      ? max > min
        ? f.status.branches === min
          ? true
          : false
        : true
      : true;

    return (
      f &&
      p.money > f.price.branchPrice &&
      f.type === FieldType.COMPANY &&
      f.status &&
      m &&
      !isMortgaged &&
      (!alreadyUp || !BOARD_PARAMS.BRANCHES.ONE_BRANCH_PER_TURN) &&
      f.status.branches <= 4 &&
      byOrder
    );
  }

  async canLevelDown(gameId: string, fieldId: number): Promise<boolean> {
    if (!gameId || !fieldId) return false;
    const f = await this.fields.getField(gameId, fieldId);
    const p = await this.players.getActingPlayer(gameId);
    const hasMonopoly = await this.playerHasMonopoly(f, p);
    const isMortgaged = await this.isGroupMortgaged(gameId, f);

    const group = await this.fields.getFieldsByGroup(gameId, f.fieldGroup);
    const branches = group.map((v) => v.status.branches);
    const max = Math.max(...branches);
    const min = Math.min(...branches);
    const byOrder = BOARD_PARAMS.BRANCHES.BUILD_QEUEU
      ? max > min
        ? f.status.branches === max
          ? true
          : false
        : true
      : true;

    return (
      f &&
      (await this.isCompany(gameId, fieldId)) &&
      f.status &&
      hasMonopoly &&
      !isMortgaged &&
      f.type === FieldType.COMPANY &&
      f.status.branches > 0 &&
      byOrder
    );
  }

  async isContractValid(gameId: string, contract: IContract): Promise<boolean> {
    if (!contract) {
      return false;
    }

    const noFields =
      !contract.fieldIdsFrom.length && !contract.fieldIdsFrom.length;

    if (noFields) {
      return false;
    }

    const muchMoney = contract.moneyFrom && contract.moneyTo;
    if (muchMoney) {
      return false;
    }

    const looksTricky =
      (contract.moneyFrom + contract.fieldFromPrice) / 2 >
        contract.moneyTo + contract.fieldToPrice ||
      (contract.moneyTo + contract.fieldToPrice) / 2 >
        contract.moneyFrom + contract.fieldFromPrice;

    if (looksTricky) {
      return false;
    }

    const fields = (await this.store.getFieldsStore(gameId)).fields.filter(
      (v) => v.status,
    );

    const fieldsFrom = fields.filter(
      (v) => v.status.userId === contract.fromUserId,
    );
    const fieldsTo = fields.filter(
      (v) => v.status.userId === contract.toUserId,
    );

    console.log(fields.map((v) => v.fieldId));
    console.log(fieldsFrom.map((v) => v.fieldId));
    console.log(fieldsTo.map((v) => v.fieldId));

    for (const id of contract.fieldIdsFrom) {
      if (!fieldsFrom.find((v) => v.fieldId === id)) {
        return false;
      }
    }

    for (const id of contract.fieldIdsTo) {
      if (!fieldsTo.find((v) => v.fieldId === id)) {
        return false;
      }
    }
    return true;
  }
}
