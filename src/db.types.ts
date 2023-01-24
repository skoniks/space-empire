import {
  InferAttributes,
  InferCreationAttributes,
  ModelAttributeColumnOptions,
} from 'sequelize';
import { Column as SequelizeColumn, Model } from 'sequelize-typescript';

export class Entity<M extends Model> extends Model<
  InferAttributes<M>,
  InferCreationAttributes<M>
> {}

export const Column = (options: Partial<ModelAttributeColumnOptions>) =>
  SequelizeColumn({ ...options, allowNull: false });

export const NullColumn = (options: Partial<ModelAttributeColumnOptions>) =>
  SequelizeColumn({ ...options, allowNull: true, defaultValue: null });
