import { Column, Entity, Index } from 'typeorm';

@Entity()
export class TokensEntity {
  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  token: string;

  @Column()
  expires: Date;
}
