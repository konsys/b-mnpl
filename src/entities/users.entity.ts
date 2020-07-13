import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  userId?: number;

  @Column({ default: false })
  vip: boolean;

  @Exclude()
  @Column({ default: null })
  registrationType?: string;

  @Column()
  name: string;

  @Exclude()
  @Column()
  email: string;

  @Exclude()
  @Column({ default: 'password' })
  password: string;

  @Column({ default: null })
  team?: string;

  @Column({ default: null })
  avatar?: string;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column({ default: true })
  isActive?: boolean;

  @Exclude()
  @Column({ default: false })
  isBlocked?: boolean;

  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }
}
