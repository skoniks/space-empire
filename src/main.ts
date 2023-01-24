import 'dotenv/config';
import 'reflect-metadata';

import { TelegramBotCommand } from 'puregram/generated';
import BOT from './bot.module';
import DB from './db.module';

const commands: TelegramBotCommand[] = [
  { command: '/start', description: 'Запуск бота' },
];

async function bootstrap() {
  await DB.authenticate();
  await DB.sync({ force: true });
  await BOT.api.setMyCommands({ commands });
  await BOT.updates.startPolling();
}

bootstrap();
