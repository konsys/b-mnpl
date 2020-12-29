import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';
import { IInventoryItems } from '../types/game/game.types';

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
  @Index({ unique: true })
  email?: string;

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

  @Exclude()
  @Column({ default: true })
  isActive?: boolean;

  @Exclude()
  @Column({ default: false })
  isBlocked?: boolean;

  @Column('simple-json', { default: null })
  inventory: IInventoryItems[];

  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }
}
