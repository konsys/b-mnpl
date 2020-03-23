import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class BoardField {
  @PrimaryGeneratedColumn()
  fieldId: number;

  @Column()
  fieldPosition: number;

  @Column({ default: false })
  mnplSpecial: number;

  @Column({ default: null })
  price: number;

  @Column({ default: null })
  mnplGroup: number;

  @Column({ default: null })
  mnplCorner: number;

  @Column()
  mnplLine: number;

  @Column({ default: false })
  isJail?: boolean;

  @Column()
  level: number;

  @Column()
  imgSrc: string;

  @Column()
  name: string;
}
