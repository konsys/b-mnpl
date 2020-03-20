import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ default: false })
  vip: boolean;

  @Column()
  registrationType: string;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isBlocked: boolean;
}
