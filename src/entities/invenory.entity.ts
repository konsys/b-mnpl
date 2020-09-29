import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { InventoryType } from 'src/types/game/game.types';

@Entity()
export class InventoryEntity {
  @PrimaryGeneratedColumn()
  inventoryId?: number;

  @Column('enum', {
    name: 'inventoryType',
    enum: InventoryType,
  })
  type: InventoryType;

  @Column()
  name: string;

  @Column()
  imgSrc: string;

  @Column()
  created: Date;
}
