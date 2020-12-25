import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class TokensEntity {
  @PrimaryGeneratedColumn()
  tokenId?: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  token: string;

  @Column()
  expires: Date;
}
