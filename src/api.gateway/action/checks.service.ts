import { IField, IFieldAction, IPlayer } from 'src/types/Board/board.types';

import { BOARD_PARAMS } from 'src/params/board.params';
import { FieldType } from 'src/entities/board.fields.entity';
import { FieldsService } from 'src/api.gateway/fields/fields.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { StoreService } from 'src/api.gateway/action/store.service';
import { UsersService } from 'src/api.gateway/users/users.service';

@Injectable()
export class ChecksService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => FieldsService))
    private readonly fieldsService: FieldsService,
    private readonly store: StoreService,
  ) {}

  async isTax(gameId: string): Promise<boolean> {
    return (
      (await this.fieldsService.getActingField(gameId)).type === FieldType.TAX
    );
  }

  async isStartPass(gameId: string): Promise<boolean> {
    const dices = await this.store.getDicesStore(gameId);
    const player = await this.usersService.getActingPlayer(gameId);

    return dices.sum > 0 && player.meanPosition - dices.sum < 0;
  }

  async isJail(gameId: string): Promise<boolean> {
    return (
      (await this.fieldsService.getActingField(gameId)).type === FieldType.JAIL
    );
  }

  async isFieldMortgaged(gameId: string, fieldId: number): Promise<boolean> {
    const field = await this.fieldsService.getFieldById(gameId, fieldId);
    return field && field.status && field.status.mortgaged > 0;
  }

  async isCompany(gameId: string, fieldId: number) {
    const type = (await this.fieldsService.getFieldById(gameId, fieldId)).type;
    return (
      type &&
      (type === FieldType.COMPANY ||
        type === FieldType.AUTO ||
        type === FieldType.IT)
    );
  }
  async isChance(gameId: string): Promise<boolean> {
    return (
      (await this.fieldsService.getActingField(gameId)).type ===
      FieldType.CHANCE
    );
  }

  async isCompanyForSale(gameId: string, fieldId: number): Promise<boolean> {
    const f = await this.fieldsService.getFieldById(gameId, fieldId);
    return (await this.isCompany(gameId, f.fieldId)) && f && !f.status;
  }

  async isMyField(gameId: string, fieldId: number): Promise<boolean> {
    const field = await this.fieldsService.getFieldById(gameId, fieldId);
    return (
      this.isCompany(gameId, fieldId) &&
      field.status &&
      field.status.userId ===
        (await this.usersService.getActingPlayer('kkk')).userId
    );
  }

  async canBuyField(
    gameId: string,
    fieldId: number,
    p: IPlayer,
  ): Promise<boolean> {
    return (
      (await this.isCompany(gameId, fieldId)) &&
      (await this.fieldsService.getFieldById(gameId, fieldId)).price
        .startPrice <= p.money
    );
  }

  async whosField(gameId: string): Promise<number> {
    const p = await this.fieldsService.getActingField(gameId);

    return (p.status && p.status.userId) || BOARD_PARAMS.BANK_PLAYER_ID;
  }

  async noActionField(gameId: string): Promise<boolean> {
    const field = await this.fieldsService.getActingField(gameId);
    return (
      field.type === FieldType.TAKE_REST || field.type === FieldType.CASINO
    );
  }

  async playerHasMonopoly(
    gameId: string,
    f: IField,
    p: IPlayer,
  ): Promise<boolean> {
    const sg = await this.fieldsService.getPlayerGroupFields(gameId, f, p);
    const pg = await this.fieldsService.getFieldsByGroup(gameId, f.fieldGroup);
    return sg.length === pg.length;
  }

  async isGroupMortgaged(gameId: string, f: IField): Promise<boolean> {
    const p = await this.usersService.getActingPlayer(gameId);
    const sg = await this.fieldsService.getPlayerGroupFields(gameId, f, p);
    return sg.some((v) => v.status && v.status.mortgaged > 0);
  }

  async groupHasBranches(gameId: string, f: IField): Promise<boolean> {
    return (
      await this.fieldsService.getFieldsByGroup(gameId, f.fieldGroup)
    ).some((v) => v.status && v.status.branches > 0);
  }

  async canMortgage(gameId: string, fieldId: number): Promise<boolean> {
    const f = await this.fieldsService.getFieldById(gameId, fieldId);
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
    const f = await this.fieldsService.getFieldById(gameId, fieldId);
    const p = await this.usersService.getActingPlayer(gameId);
    return (
      f &&
      (await this.isCompany(gameId, fieldId)) &&
      f.status &&
      f.status.mortgaged > 0 &&
      f.status.userId === p.userId
    );
  }

  async canLevelUp(gameId: string, fieldId: number): Promise<boolean> {
    const f = await this.fieldsService.getFieldById(gameId, fieldId);
    const p = await this.usersService.getActingPlayer(gameId);
    const m = await this.playerHasMonopoly(gameId, f, p);
    const isMortgaged = await this.isGroupMortgaged(gameId, f);

    const group = await this.fieldsService.getFieldsByGroup(
      gameId,
      f.fieldGroup,
    );
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
    const f = await this.fieldsService.getFieldById(gameId, fieldId);
    const p = await this.usersService.getActingPlayer(gameId);
    const hasMonopoly = await this.playerHasMonopoly(gameId, f, p);
    const isMortgaged = await this.isGroupMortgaged(gameId, f);

    const group = await this.fieldsService.getFieldsByGroup(
      gameId,
      f.fieldGroup,
    );
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
}
