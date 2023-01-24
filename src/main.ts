import 'dotenv/config';
import 'reflect-metadata';
import BOT from './bot.module';

import DB from './db.module';

async function bootstrap() {
  await DB.authenticate();
  await DB.sync({ force: true });
  await BOT.updates.startPolling();
  await BOT.api.setMyCommands({
    commands: [
      {
        command: '/start',
        description: 'Запуск бота',
      },
    ],
  });
  BOT.updates.on('message', (context) => {
    console.log(context);
    context.reply(context.text || '...');
  });
  BOT.updates.on('callback_query', (context) =>
    context.answerCallbackQuery({ text: 'Уффф' }),
  );
}

bootstrap();
