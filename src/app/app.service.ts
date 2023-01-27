import { CallbackQueryContext, MessageContext } from 'puregram';
import { Transaction } from 'sequelize';
import DB from '../database/db.module';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import { authorize } from './auth.service';
import { colonyMenu, colonyProfit } from './colony.service';
import { mainMenu } from './main.service';

async function handleAction(
  colony: Colony,
  action: ActionType | null,
  transaction: Transaction,
) {
  switch (action) {
    case ActionType.back:
      await mainMenu(colony);
      break;
    case ActionType.fresh:
      if (colony.action.type) {
        await handleAction(colony, colony.action.type, transaction);
      } else await mainMenu(colony);
      break;
    case ActionType.colony:
      await colonyMenu(colony);
      break;
    case ActionType.profit:
      await colonyProfit(colony, transaction);
      break;
    case ActionType.military:
      break;
    case ActionType.trade:
      break;
    case ActionType.help:
      break;
    default:
      await mainMenu(colony, true);
      break;
  }
}

export function handleCallback(context: CallbackQueryContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const colony = await authorize(context.senderId, transaction);
    const { action = null } = <{ action: ActionType }>context.queryPayload;
    await handleAction(colony, action, transaction);
    await colony.action.save({ transaction });
    await colony.save({ transaction });
    await context.answerCallbackQuery({});
  });
}

export function handleMessage(context: MessageContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const colony = await authorize(context.senderId, transaction);
    await handleAction(colony, null, transaction);
    await colony.action.save({ transaction });
    await colony.save({ transaction });
    await context.delete().catch();
  });
}
