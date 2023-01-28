import { InlineKeyboard } from 'puregram';
import DB from '../database/db.module';
import Action, { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import Factory from '../entities/factory.entity';
import TG from '../telegram/tg.module';
import { drawMenu } from './menu.service';

export async function tradeMenu(colony: Colony) {
  const lines = [
    '⚖️ Биржа - обмен ресурсов',
    '',
    `💸 Кредиты: <b>${colony.money}</b>`,
    `💎 Минералы: <b>${colony.iron}</b>`,
    `🍖 Провизия: <b>${colony.food}</b>`,
  ];
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '1 💎 + 1 🍖 = 1 💸',
        payload: { action: ActionType.money },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '1 💸 = 1 💎',
        payload: { action: ActionType.iron },
      }),
      InlineKeyboard.textButton({
        text: '1 💸 = 1 🍖',
        payload: { action: ActionType.food },
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
  await drawMenu(colony, lines.join('\n'), keyboard);
  colony.action.type = ActionType.trade;
}

export async function tradeProcess(
  colony: Colony,
  action: ActionType,
  lines: string[] = [],
) {
  let icon = '';
  let available = 0;
  switch (action) {
    case ActionType.money:
      icon = '💸';
      available = Math.min(colony.iron, colony.food);
      break;
    case ActionType.iron:
      icon = '💎';
      available = colony.money;
      break;
    case ActionType.food:
      icon = '🍖';
      available = colony.money;
      break;
  }
  lines = [
    ...lines,
    `⚖️ Доступно: <b>${available} ${icon}</b>`,
    '',
    '[📝 сумма обмена ]',
  ];
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '⬅️ Назад',
        payload: { action: ActionType.fresh },
      }),
    ],
  ]);
  await drawMenu(colony, lines.join('\n'), keyboard);
  colony.action.type = ActionType.trade;
  tradeHandle(colony, action);
}

async function tradeHandle(colony: Colony, action: ActionType) {
  try {
    const { id: message_id, text } = await TG.prompt(colony.chat);
    await TG.api.deleteMessage({ chat_id: colony.chat, message_id }).catch();
    const amount = parseInt(text || '') || 0;
    await DB.transaction(async (transaction) => {
      await colony.reload({
        include: [Action, Factory],
        transaction,
        lock: true,
      });
      let available = 0;
      switch (action) {
        case ActionType.money:
          available = Math.min(colony.iron, colony.food);
          break;
        case ActionType.iron:
          available = colony.money;
          break;
        case ActionType.food:
          available = colony.money;
          break;
      }
      if (amount <= 0 || amount > available) {
        return tradeProcess(colony, action, ['❗️ Введена неверная сумма', '']);
      }
      switch (action) {
        case ActionType.money:
          colony.iron -= amount;
          colony.food -= amount;
          colony.money += amount;
          break;
        case ActionType.iron:
          colony.money -= amount;
          colony.iron += amount;
          break;
        case ActionType.food:
          colony.money -= amount;
          colony.food += amount;
          break;
      }
      await colony.save({ transaction });
      await tradeMenu(colony);
    });
  } catch {
    await tradeMenu(colony);
  }
}
