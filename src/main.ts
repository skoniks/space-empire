import 'dotenv/config';
import 'reflect-metadata';

import { TelegramBotCommand } from 'puregram/generated';
import DB from './database/db.module';
import BOT from './telegram/tg.module';

const commands: TelegramBotCommand[] = [
  { command: '/start', description: 'Запуск бота' },
];

async function bootstrap() {
  await DB.authenticate();
  await DB.sync({ force: false });
  await BOT.api.setMyCommands({ commands });
  await BOT.updates.startPolling();
}

bootstrap();
