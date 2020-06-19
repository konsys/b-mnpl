import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { IFieldPrice, IFieldRent } from 'src/types/board.types';

export enum FieldType {
  CHANCE = 'chance',
  COMPANY = 'company',
  JAIL = 'jail',
  ROULETTE = 'roulette',
  CASINO = 'casino',
  START = 'start',
  TAX = 'tax',
  IT = 'IT',
  AUTO = 'auto',
  TAKE_REST = 'takeRest',
}

export enum CurrencyType {
  DOLLAR = '$',
  MULTIPLIER = 'x',
}

@Entity()
export class BoardFieldsEntity {
  @PrimaryGeneratedColumn()
  fieldId?: number;

  @Column()
  fieldPosition: number;

  @Column({ default: null })
  mnplSpecial?: number;

  @Column({ default: null })
  fieldGroup?: number;

  @Column({ default: null })
  fieldCorner?: number;

  @Column({ default: null })
  fieldLine?: number;

  @Column({ default: false })
  isJail?: boolean;

  @Column({ default: null })
  level: number;

  @Column({ default: null })
  imgSrc: string;

  @Column({ default: null })
  name: string;

  @Column('enum', {
    name: 'fieldsType',
    enum: FieldType,
  })
  type: FieldType;

  @Column('enum', {
    name: 'currencyType',
    enum: CurrencyType,
    default: CurrencyType.DOLLAR,
  })
  currency?: CurrencyType;

  @Column('simple-json', { default: null })
  price?: IFieldPrice;

  @Column('simple-json', { default: null })
  rent?: IFieldRent;
}
