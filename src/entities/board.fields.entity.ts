import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IFieldPrice, IFieldRent } from 'src/types/board/board.types';

export enum FieldGroupName {
  IT = 'IT компании',
  WEB = 'Веб-сервисы',
  PARFUME = 'Парфюмерия',
  AUTO = 'Автомобили',
  CLOTHES = 'Одежда',
  DRINKS = 'Напитки',
  AVIA = 'Авиалинии',
  RESTARAUNT = 'Рестораны',
  HOTEL = 'Отели',
  ELECTRONIC = 'Электроника',
}

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

  @Column({ default: 1 })
  level: number;

  @Column({ default: null })
  imgSrc: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  description?: string;

  @Column('enum', { name: 'fieldGroupName', enum: FieldGroupName })
  fieldGroupName?: FieldGroupName;

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
