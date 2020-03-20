import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  fieldId: number;

  @Column()
  fieldPosition: number;

  @Column({ default: false })
  mnplSpecial: boolean;

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
