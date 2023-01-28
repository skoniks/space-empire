import { InlineKeyboard } from 'puregram';
import { Op, Transaction } from 'sequelize';
import Action, { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import Factory, { FactoryType } from '../entities/factory.entity';
import { handleAction } from './app.service';
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
        iron += i.count * i.profit();
        mines.push(i);
        break;
      case FactoryType.farm:
        farmsProfit += i.level * i.count;
        food += i.count * i.profit();
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
    switch (i.type) {
      case FactoryType.mine:
        colony.iron += i.count * i.profit();
        break;
      case FactoryType.farm:
        colony.food += i.count * i.profit();
        break;
    }
    i.updatedAt = new Date();
    i.changed('updatedAt', true);
    await i.save({ transaction });
  }
  await colonyMenu(colony);
  return { text: 'Ресурсы собраны' };
}

export async function colonFactoriesMeny(
  colony: Colony,
  type: FactoryType,
  action: ActionType,
) {
  let totalProfit = 0;
  let totalUpgrade = 0;
  const factories: Factory[] = [];
  for (const i of colony.factories) {
    if (!i.count || i.type != type) continue;
    if (i.level < colony.level) totalUpgrade += i.count;
    totalProfit += i.level * i.count;
    factories.push(i);
  }
  factories.sort((a, b) => a.level - b.level);
  const power = colony.power();
  const purchase = Math.min(power.left / 5, colony.money / 50) | 0;
  const upgrade = Math.min(totalUpgrade, colony.money / 25) | 0;
  const title = type == FactoryType.mine ? '🛠 Шахты' : '🐷 Фермы';
  const lines = [
    `${title} → ${totalProfit} / мин:`,
    ...factories.map((i) => format(i)),
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
  colony.action.type = action;
}

export function colonMinesMeny(colony: Colony) {
  return colonFactoriesMeny(colony, FactoryType.mine, ActionType.mines);
}

export function colonFarmsMeny(colony: Colony) {
  return colonFactoriesMeny(colony, FactoryType.farm, ActionType.farms);
}

export async function colonyPurchase(colony: Colony, transaction: Transaction) {
  const type =
    colony.action.type == ActionType.mines
      ? FactoryType.mine
      : FactoryType.farm;
  const title = type == FactoryType.mine ? '🛠 Шахта' : '🐷 Ферма';
  const power = colony.power();
  if (power.left < 5 || colony.money < 50)
    return { text: 'Недостаточно ресурсов' };
  const factory = await Factory.findOne({
    where: { type, level: 1, colonyId: colony.id },
    transaction,
    lock: true,
  });
  if (!factory) return { text: 'Нечего покупать' };
  switch (factory.type) {
    case FactoryType.mine:
      colony.iron += factory.count * factory.profit();
      break;
    case FactoryType.farm:
      colony.food += factory.count * factory.profit();
      break;
  }
  factory.count += 1;
  factory.updatedAt = new Date();
  factory.changed('updatedAt', true);
  await factory.save({ transaction });
  colony.money -= 50;
  await colony.save({ transaction });
  await colony.reload({
    include: [Action, Factory],
    transaction,
    lock: true,
  });
  await handleAction(colony, colony.action.type, transaction);
  return { text: `${title} приобретена` };
}

export async function colonyUpgrade(colony: Colony, transaction: Transaction) {
  if (colony.action.type == ActionType.colony) {
    //
  } else {
    const type =
      colony.action.type == ActionType.mines
        ? FactoryType.mine
        : FactoryType.farm;
    const title = type == FactoryType.mine ? '🛠 Шахта' : '🐷 Ферма';
    const factory1 = await Factory.findOne({
      where: {
        type,
        count: { [Op.gte]: 1 },
        level: { [Op.lt]: colony.level },
        colonyId: colony.id,
      },
      transaction,
      lock: true,
    });
    if (!factory1) return { text: 'Нечего улучшать' };
    const [factory2] = await Factory.findOrCreate({
      where: { type, level: factory1.level + 1, colonyId: colony.id },
      transaction,
      lock: true,
    });
    switch (factory1.type) {
      case FactoryType.mine:
        colony.iron += factory1.count * factory1.profit();
        break;
      case FactoryType.farm:
        colony.food += factory1.count * factory1.profit();
        break;
    }
    factory1.count -= 1;
    factory1.updatedAt = new Date();
    factory1.changed('updatedAt', true);
    await factory1.save({ transaction });
    switch (factory2.type) {
      case FactoryType.mine:
        colony.iron += factory2.count * factory2.profit();
        break;
      case FactoryType.farm:
        colony.food += factory2.count * factory2.profit();
        break;
    }
    factory2.count += 1;
    factory2.updatedAt = new Date();
    factory2.changed('updatedAt', true);
    await factory2.save({ transaction });
    colony.money -= 25;
    await colony.save({ transaction });
    await colony.reload({
      include: [Action, Factory],
      transaction,
      lock: true,
    });
    await handleAction(colony, colony.action.type, transaction);
    return { text: `${title} улучшена` };
  }
}
