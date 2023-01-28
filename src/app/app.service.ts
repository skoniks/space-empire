import { CallbackQueryContext, MessageContext } from 'puregram';
import { Transaction } from 'sequelize';
import DB from '../database/db.module';
import { ActionType } from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import { authorize } from './auth.service';
import {
  colonFarmsMeny,
  colonMinesMeny,
  colonyMenu,
  colonyProfit,
  colonyPurchase,
} from './colony.service';
import { mainMenu } from './main.service';

async function handleAction(
  colony: Colony,
  action: ActionType | null,
  transaction: Transaction,
): Promise<{ text?: string }> {
  let result;
  switch (action) {
    case ActionType.menu:
      result = await mainMenu(colony);
      break;
    case ActionType.back:
      switch (colony.action.type) {
        case ActionType.mines:
        case ActionType.farms:
          colony.action.type = ActionType.colony;
          break;
        default:
          colony.action.type = ActionType.menu;
          break;
      }
      result = await handleAction(colony, colony.action.type, transaction);
      break;
    case ActionType.fresh:
      result = await handleAction(colony, colony.action.type, transaction);
      break;
    case ActionType.colony:
      result = await colonyMenu(colony);
      break;
    case ActionType.profit:
      result = await colonyProfit(colony, transaction);
      break;
    case ActionType.upgrade:
      break;
    case ActionType.purchase:
      switch (colony.action.type) {
        case ActionType.mines:
        case ActionType.farms:
          result = await colonyPurchase(colony, transaction);
          break;
        default:
          break;
      }
      break;
    case ActionType.military:
      break;
    case ActionType.trade:
      break;
    case ActionType.mines:
      result = await colonMinesMeny(colony);
      break;
    case ActionType.farms:
      result = await colonFarmsMeny(colony);
      break;
    case ActionType.help:
      break;
    default:
      colony.action.message = 0;
      result = await mainMenu(colony);
      break;
  }
  return result || {};
}

export function handleCallback(context: CallbackQueryContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const colony = await authorize(context.senderId, transaction);
    const { action = null } = <{ action: ActionType }>context.queryPayload;
    const { text = '' } = await handleAction(colony, action, transaction);
    await colony.action.save({ transaction });
    await colony.save({ transaction });
    await context.answerCallbackQuery({ text });
  });
}

export function handleMessage(context: MessageContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const colony = await authorize(context.senderId, transaction);
    const action = context.text == '/start' ? null : ActionType.menu;
    await handleAction(colony, action, transaction);
    await colony.action.save({ transaction });
    await colony.save({ transaction });
    await context.delete().catch();
  });
}
