import { CreationOptional, NonAttribute } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Column, Entity, NullColumn } from '../database/db.types';
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

  @NullColumn({ type: DataType.INTEGER })
  declare type: FactoryType;

  @Column({ type: DataType.INTEGER })
  declare level: number;

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

  @DeletedAt
  declare deletedAt: CreationOptional<Date>;
}

export default Factory;
