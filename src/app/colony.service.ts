import { InlineKeyboard } from 'puregram';
import { Transaction } from 'sequelize';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import Factory, { FactoryType } from '../entities/factory.entity';
import { drawMenu } from './menu.service';

const format = (i: Factory) =>
  `  - ʟᴠʟ ${i.level} : ${i.count} шт. → ${i.level * i.count} / мин`;

export async function colonyMenu(colony: Colony) {
  const power = colony.power();
  let iron = 0;
  let food = 0;
  let minesProfit = 0;
  let farmsProfit = 0;
  const mines: Factory[] = [];
  const farms: Factory[] = [];
  for (const i of colony.factories) {
    if (!i.count) continue;
    switch (i.type) {
      case FactoryType.mine:
        minesProfit += i.level * i.count;
        iron += i.profit();
        mines.push(i);
        break;
      case FactoryType.farm:
        farmsProfit += i.level * i.count;
        food += i.profit();
        farms.push(i);
        break;
    }
  }
  mines.sort((a, b) => a.level - b.level);
  farms.sort((a, b) => a.level - b.level);
  const lines = [
    `🏭 База [ <b>ʟᴠʟ ${colony.level}</b> ] ( ${power.left} / ${power.total}⚡️)`,
    `📦 Собрать: [ <b>${iron} 💎</b>], [ <b>${food} 🍖</b>]`,
    '',
    `🛠 Шахты → ${minesProfit} / мин:`,
    ...mines.map((i) => format(i)),
    '',
    `🐷 Фермы → ${farmsProfit} / мин:`,
    ...farms.map((i) => format(i)),
  ];
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '📦 Собрать',
        payload: { action: ActionType.profit },
      }),
      InlineKeyboard.textButton({
        text: '🏭 Улучшить',
        payload: { action: ActionType.upgrade },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🛠 Шахты',
        payload: { action: ActionType.mines },
      }),
      InlineKeyboard.textButton({
        text: '🐷 Фермы',
        payload: { action: ActionType.farms },
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
  return { text: 'Ресурсы собраны' };
}

export async function colonMinesMeny(colony: Colony) {
  let totalProfit = 0;
  let totalUpgrade = 0;
  const mines: Factory[] = [];
  for (const i of colony.factories) {
    if (!i.count || i.type != FactoryType.mine) continue;
    if (i.level < colony.level) totalUpgrade += i.count;
    totalProfit += i.level * i.count;
    mines.push(i);
  }
  mines.sort((a, b) => a.level - b.level);
  const power = colony.power();
  const purchase = Math.floor(Math.min(power.left / 5, colony.money / 50));
  const upgrade = Math.floor(Math.min(totalUpgrade, colony.money / 25));
  const lines = [
    `🛠 Шахты → ${totalProfit} / мин:`,
    ...mines.map((i) => format(i)),
    '',
    `Ресурсы: <b>${colony.money} 💸, ${power.left} / ${power.total}⚡️</b>`,
    '',
    '🛄 Покупка: <b>50 💸, 5⚡️</b>',
    `  - Доступно: ${purchase} шт.`,
    '',
    '💹 Улучшение: <b>25 💸, 0⚡️</b>',
    `  - Доступно: ${upgrade} шт.`,
  ];
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '🛄 Купить',
        payload: { action: ActionType.purchase },
      }),
      InlineKeyboard.textButton({
        text: '💹 Улучшить',
        payload: { action: ActionType.upgrade },
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
  colony.action.type = ActionType.mines;
}

export async function colonFarmsMeny(colony: Colony) {
  //
}

export async function colonyPurchase(colony: Colony, transaction: Transaction) {
  const power = colony.power();
  const purchase = Math.floor(Math.min(power.left / 5, colony.money / 50));
  if (purchase < 1) return { text: 'Недостаточно ресурсов' };
  for (const i of colony.factories) {
    if (i.type != FactoryType.mine) continue;
    if (i.level != 1) continue;
    colony.iron += i.profit();
    i.count += 1;
    i.updatedAt = new Date();
    await i.save({ transaction });
  }
  colony.money -= 50;
  await colonMinesMeny(colony);
  return { text: 'Шахта куплена' };
}
