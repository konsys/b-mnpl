import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  userId?: number;

  @Column({ default: false })
  vip?: boolean;

  @Column({ default: null })
  registrationType?: string;

  @Column()
  name: string;

  @Column({ default: null })
  avatar?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ default: false })
  isBlocked?: boolean;
}
