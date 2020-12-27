import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TokensEntity {
  @Column()
  @PrimaryColumn()
  @Index({ unique: true })
  userId: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  token: string;

  @Column()
  expires: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  time?: string;
}
