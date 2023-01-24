import { Sequelize } from 'sequelize-typescript';

const DB = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_BASE,
  timezone: process.env.TZ_OFFSET,
  dialectOptions: { decimalNumbers: true },
  models: [],
  benchmark: true,
  logging: true,
  // pool: {},
});

export default DB;
