import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class BoardField {
  @PrimaryGeneratedColumn()
  fieldId: number;

  @Column()
  fieldPosition: number;

  @Column({ default: null })
  mnplSpecial?: number;

  @Column({ default: null })
  price?: number;

  @Column({ default: null })
  mnplGroup?: number;

  @Column({ default: null })
  mnplCorner?: number;

  @Column({ default: null })
  mnplLine?: number;

  @Column({ default: false })
  isJail?: boolean;

  @Column({ default: null })
  level?: number;

  @Column({ default: null })
  imgSrc?: string;

  @Column({ default: null })
  name?: string;
}
