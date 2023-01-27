import { CallbackQueryContext, MessageContext } from 'puregram';
import { Transaction } from 'sequelize';
import DB from '../database/db.module';
import User, { Action } from '../entities/user.entity';
import { authorize } from './auth.service';
import { colonyMenu, mainMenu } from './menu.service';

async function handleAction(
  user: User,
  action: Action | null,
  transaction: Transaction,
) {
  switch (action) {
    case Action.back:
      await mainMenu(user);
      break;
    case Action.fresh:
      if (user.action) {
        await handleAction(user, user.action, transaction);
      } else await mainMenu(user);
      break;
    case Action.colony:
      await colonyMenu(user);
      break;
    case Action.military:
      break;
    case Action.trade:
      break;
    case Action.help:
      break;
    default:
      break;
  }
}

export function handleCallback(context: CallbackQueryContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const user = await authorize(context.senderId, transaction);
    const { action = null } = <{ action: Action }>context.queryPayload;
    await handleAction(user, action, transaction);
    await context.answerCallbackQuery({});
    await user.save({ transaction });
  });
}

export function handleMessage(context: MessageContext) {
  return DB.transaction(async (transaction) => {
    if (!context.senderId) return;
    const user = await authorize(context.senderId, transaction);
    if (user.action) {
      await handleAction(user, user.action, transaction);
    } else await mainMenu(user);
    await context.delete().catch();
    await user.save({ transaction });
  });
}
