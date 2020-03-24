import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class UserGameStatusEntity {
  @PrimaryGeneratedColumn()
  userGameStatusId: number;

  @Column()
  doublesRolledAsCombo: number;

  @Column()
  jailed: boolean;

  @Column()
  unjailAttempts: number;

  @Column()
  money: number;

  @Column()
  canUseCredit: boolean;

  @Column()
  creditPayRound: boolean;

  @Column()
  creditToPay: number;

  @Column()
  creditNextTakeRound: number;

  @Column()
  score: number;

  @Column()
  frags: string;

  @Column()
  additionalTime: number;

  @Column()
  timeReduceLevel: number;

  @Column()
  position: number;

  @Column()
  userId: number;

  @Column()
  gameId: string;
}
