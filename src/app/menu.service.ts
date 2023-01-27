import { APIError, HTML, InlineKeyboard } from 'puregram';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import TG from '../telegram/tg.module';

async function drawMenu(
  colony: Colony,
  text: string,
  keyboard: InlineKeyboard,
  force = false,
) {
  const edit = () =>
    TG.api.editMessageText({
      text,
      chat_id: colony.chat,
      message_id: colony.action.message,
      reply_markup: keyboard,
      parse_mode: 'HTML',
    });
  const send = () =>
    TG.api.sendMessage({
      text,
      chat_id: colony.chat,
      reply_markup: keyboard,
      parse_mode: 'HTML',
    });
  try {
    if (force) {
      if (colony.action.message) {
        await TG.api
          .deleteMessage({
            chat_id: colony.chat,
            message_id: colony.action.message,
          })
          .catch();
      }
      const { message_id } = await send();
      colony.action.message = message_id;
    } else {
      await edit();
    }
  } catch (error) {
    if (
      error instanceof APIError &&
      error.message.includes('message to edit not found')
    ) {
      const { message_id } = await send();
      colony.action.message = message_id;
    }
  }
}

export async function mainMenu(colony: Colony, force = false) {
  const text = [
    `🚩 Колония: ${HTML.bold(colony.name)}`,
    '',
    `💸 Кредиты: ${HTML.bold(`${colony.money}`)}`,
    `💎 Минералы: ${HTML.bold(`${colony.iron}`)}`,
    `🍖 Провизия: ${HTML.bold(`${colony.food}`)}`,
  ].join('\n');
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '🏭 База',
        payload: { action: ActionType.colony },
      }),
      InlineKeyboard.textButton({
        text: '⚔️ Армия',
        payload: { action: ActionType.military },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '⚖️ Биржа',
        payload: { action: ActionType.trade },
      }),
      InlineKeyboard.textButton({
        text: '📔 Справка',
        payload: { action: ActionType.help },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🔄 Обновить',
        payload: { action: ActionType.fresh },
      }),
    ],
  ]);

  await drawMenu(colony, text, keyboard, force);
  if (colony.action) colony.action.type = null;
}

export async function colonyMenu(colony: Colony) {
  // const mines =

  const text = [
    `🏭 База [${HTML.bold(
      ` ʟᴠʟ ${colony.level} `,
    )}] ( 10 / ${colony.power()}⚡️)`,
    '',
    `🛠 Шахты [ ${10029} 💎]: `,
    '  - ʟᴠʟ 1 : 100 шт. = 100 / мин',
    '  - ʟᴠʟ 2 : 50 шт. = 100 / мин',
    '',
    `🐷 Фермы ( ${0} / мин ) => 🍖`,
  ].join('\n');
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '📦 Собрать',
        payload: { action: ActionType.colony },
      }),
      InlineKeyboard.textButton({
        text: '🏭 Улучшить',
        payload: { action: ActionType.colony },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🛠 Шахты',
        payload: { action: ActionType.colony },
      }),
      InlineKeyboard.textButton({
        text: '🐷 Фермы',
        payload: { action: ActionType.colony },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🔄 Обновить',
        payload: { action: ActionType.fresh },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '⬅️ Назад',
        payload: { action: ActionType.back },
      }),
    ],
  ]);

  await drawMenu(colony, text, keyboard);
  if (colony.action) colony.action.type = ActionType.colony;
}

// async function militaryMenu(user: User, session: SessionContext) {
//   //
// }

// async function tradeMenu(user: User, session: SessionContext) {
//   //
// }

// async function helpMenu(user: User, session: SessionContext) {
//   //
// }
