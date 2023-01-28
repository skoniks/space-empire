import { InlineKeyboard } from 'puregram';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import { drawMenu } from './menu.service';

export async function mainMenu(colony: Colony) {
  const lines = [
    `🚩 Колония: <b>${colony.name}</b>`,
    '',
    `💸 Кредиты: <b>${colony.money}</b>`,
    `💎 Минералы: <b>${colony.iron}</b>`,
    `🍖 Провизия: <b>${colony.food}</b>`,
  ];
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

  await drawMenu(colony, lines.join('\n'), keyboard);
  colony.action.type = ActionType.menu;
}
