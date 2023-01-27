import { HTML, InlineKeyboard } from 'puregram';
import User, { Action } from '../entities/user.entity';
import TG from '../telegram/tg.module';

export async function mainMenu(user: User) {
  const text = [
    `🚩 Колония: ${HTML.bold(user.name)}`,
    '',
    `💸 Кредиты: ${HTML.bold(`${user.money}`)}`,
    `💎 Минералы: ${HTML.bold(`${user.iron}`)}`,
    `🍖 Провизия: ${HTML.bold(`${user.food}`)}`,
  ].join('\n');
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '🏭 База',
        payload: { action: Action.colony },
      }),
      InlineKeyboard.textButton({
        text: '⚔️ Армия',
        payload: { action: Action.military },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '⚖️ Биржа',
        payload: { action: Action.trade },
      }),
      InlineKeyboard.textButton({
        text: '📔 Справка',
        payload: { action: Action.help },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🔄 Обновить',
        payload: { action: Action.fresh },
      }),
    ],
  ]);
  const res = await TG.api.sendMessage({
    text,
    chat_id: user.chat,
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
  if (user.last) {
    await TG.api
      .deleteMessage({
        chat_id: user.chat,
        message_id: user.last,
      })
      .catch();
  }
  user.last = res.message_id;
  user.action = null;
}

export async function colonyMenu(user: User) {
  // function getPower(level = 1) {
  //   const power = 100 * 1.5 ** (level - 1);
  //   return power - (power % 5);
  // }
  const power = 100;
  const text = [
    `🏭 База [${HTML.bold(` ʟᴠʟ ${user.level} `)}] ( 10 / ${power}⚡️)`,
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
        text: '📦 Собрать ресурсы',
        payload: { action: Action.colony },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🛠 Купить [ 100 💸]',
        payload: { action: Action.colony },
      }),
      InlineKeyboard.textButton({
        text: '🛠 ʟᴠʟ ᴜᴘ [ 50 💸]',
        payload: { action: Action.colony },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🐷 Купить [ 100 💸]',
        payload: { action: Action.colony },
      }),
      InlineKeyboard.textButton({
        text: '🐷 ʟᴠʟ ᴜᴘ [ 50 💸]',
        payload: { action: Action.colony },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '⬅️ Назад',
        payload: { action: Action.back },
      }),
      InlineKeyboard.textButton({
        text: '🔄 Обновить',
        payload: { action: Action.fresh },
      }),
    ],
  ]);
  const res = await TG.api.sendMessage({
    text,
    chat_id: user.chat,
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
  if (user.last) {
    await TG.api
      .deleteMessage({
        chat_id: user.chat,
        message_id: user.last,
      })
      .catch();
  }
  user.last = res.message_id;
  user.action = Action.colony;
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
