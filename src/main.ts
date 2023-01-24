import 'dotenv/config';
import 'reflect-metadata';

import DB from './db.module';

async function bootstrap() {
  await DB.authenticate();
  await DB.sync({ force: false });
  console.log('Hello world');
}

bootstrap();
