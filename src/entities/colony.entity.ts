import { CreationOptional, NonAttribute } from 'sequelize';
import {
  AutoIncrement,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  HasOne,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Column, Entity } from '../database/db.types';
import Action from './action.entity';
import Factory from './factory.entity';

@Table({ tableName: 'colonies' })
class Colony extends Entity<Colony> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Unique
  @Column({ type: DataType.INTEGER })
  declare chat: number;

  @Column({ type: DataType.STRING })
  declare name: string;

  @Default(1)
  @Column({ type: DataType.INTEGER })
  declare level: CreationOptional<number>;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare money: CreationOptional<number>;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare iron: CreationOptional<number>;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare food: CreationOptional<number>;

  @HasOne(() => Action)
  declare action: NonAttribute<Action>;

  @HasMany(() => Factory)
  declare factories: NonAttribute<Factory[]>;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  power(): { total: number; left: number } {
    let total = 100 * 1.5 ** (this.level - 1);
    total = total - (total % 5);
    let left = total;
    for (const i of this.factories) {
      left -= i.count * 5;
    }
    return { total, left };
  }
}

export default Colony;
