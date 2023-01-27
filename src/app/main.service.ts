import { HTML, InlineKeyboard } from 'puregram';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import { drawMenu } from './menu.service';

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
  colony.action.type = null;
}
