import { HTML, InlineKeyboard } from 'puregram';
import { Transaction } from 'sequelize';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import Factory, { FactoryType } from '../entities/factory.entity';
import { drawMenu } from './menu.service';

export async function colonyMenu(colony: Colony) {
  const power = colony.power();
  let powerLeft = power;
  let iron = 0;
  let food = 0;
  const mines: Factory[] = [];
  const farms: Factory[] = [];
  for (const i of colony.factories) {
    if (!i.count) continue;
    powerLeft -= i.count * 5;
    switch (i.type) {
      case FactoryType.mine:
        iron += i.profit();
        mines.push(i);
        break;
      case FactoryType.farm:
        food += i.profit();
        farms.push(i);
        break;
    }
  }
  mines.sort((a, b) => a.level - b.level);
  farms.sort((a, b) => a.level - b.level);

  const format = (i: Factory) =>
    `  - ʟᴠʟ ${i.level} : ${i.count} шт. → ${i.level * i.count} / мин`;

  const text = [
    `🏭 База [${HTML.bold(
      ` ʟᴠʟ ${colony.level} `,
    )}] ( ${powerLeft} / ${power}⚡️)`,
    '',
    `🛠 Шахты [ ${iron} 💎]: `,
    ...mines.map((i) => format(i)),
    '',
    `🐷 Фермы [ ${food} 🍖]: `,
    ...farms.map((i) => format(i)),
  ].join('\n');
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '📦 Собрать',
        payload: { action: ActionType.profit },
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
  colony.action.type = ActionType.colony;
}

export async function colonyProfit(colony: Colony, transaction: Transaction) {
  for (const i of colony.factories) {
    if (!i.count) continue;
    switch (i.type) {
      case FactoryType.mine:
        colony.iron += i.profit();
        break;
      case FactoryType.farm:
        colony.food += i.profit();
        break;
    }
    i.updatedAt = new Date();
    i.changed('updatedAt', true);
    await i.save({ transaction });
  }
  await colony.save({ transaction });
  await colonyMenu(colony);
}
