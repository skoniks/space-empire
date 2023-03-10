import { CreationOptional, NonAttribute } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Column, Entity } from '../database/db.types';
import Colony from './colony.entity';

export enum FactoryType {
  mine,
  farm,
}

@Table({ tableName: 'factories' })
class Factory extends Entity<Factory> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.INTEGER })
  declare type: FactoryType;

  @Default(1)
  @Column({ type: DataType.INTEGER })
  declare level: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare count: number;

  @ForeignKey(() => Colony)
  @Column({ type: DataType.INTEGER })
  declare colonyId: number;

  @BelongsTo(() => Colony)
  declare colony: NonAttribute<Colony>;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  profit(): number {
    const time = Date.now() - this.updatedAt.valueOf();
    return ((time / (60 * 1000)) | 0) * this.level;
  }
}

export default Factory;
