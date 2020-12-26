import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TokensEntity {
  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  @PrimaryColumn()
  @Index({ unique: true })
  token: string;

  @Column()
  expires: Date;
}
