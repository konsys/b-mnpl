import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

export enum FieldType {
  CHANCE = 'chance',
  COMPANY = 'company',
  JAIL = 'jail',
  ROULETTE = 'roulette',
  CASION = 'casino',
  START = 'start',
  TAX = 'tax',
  TAKE_REST = 'takeRest',
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
  price?: number;

  @Column({ default: false })
  isAuto?: boolean;

  @Column({ default: false })
  isIT?: boolean;

  @Column({ default: null })
  fieldGroup?: number;

  @Column({ default: null })
  fieldCorner?: number;

  @Column({ default: null })
  fieldLine?: number;

  @Column({ default: false })
  isJail?: boolean;

  @Column({ default: null })
  level?: number;

  @Column({ default: null })
  imgSrc?: string;

  @Column({ default: null })
  name?: string;

  @Column('enum', { name: 'fieldsType', enum: FieldType })
  type?: string;
}
