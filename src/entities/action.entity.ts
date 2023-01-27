import { CreationOptional, NonAttribute } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Column, Entity, NullColumn } from '../database/db.types';
import Colony from './colony.entity';

export enum ActionType {
  back,
  fresh,
  colony,
  profit,
  military,
  trade,
  help,
}

@Table({ tableName: 'actions' })
class Action extends Entity<Action> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @NullColumn({ type: DataType.INTEGER })
  declare type: CreationOptional<ActionType | null>;

  @Column({ type: DataType.INTEGER })
  declare message: number;

  @ForeignKey(() => Colony)
  @Column({ type: DataType.INTEGER })
  declare colonyId: number;

  @BelongsTo(() => Colony)
  declare colony: NonAttribute<Colony>;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;
}

export default Action;
