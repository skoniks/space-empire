import { CreationOptional } from 'sequelize';
import {
  AutoIncrement,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Column, Entity } from '../database/db.types';

@Table({ tableName: 'users' })
class User extends Entity<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Unique
  @Column({ type: DataType.INTEGER })
  declare chat: number;

  @Column({ type: DataType.STRING })
  declare name: string;

  // @NullColumn({})
  // declare action: CreationOptional<>

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

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date>;
}

export default User;
