// import { PromptContext } from '@puregram/prompt';
// import { SessionContext, SessionInterface } from '@puregram/session';
// import {
//   CallbackQueryContext,
//   HTML,
//   InlineKeyboard,
//   MessageContext,
// } from 'puregram';
// import BOT from '../telegram/tg.module';
// import User from '../entities/user.entity';

import { MessageContext } from 'puregram';
import TG from '../telegram/tg.module';

// enum Actions {
//   back,
//   fresh,
//   base,
//   military,
//   trade,
//   help,
// }

// function getPower(level = 1) {
//   const power = 100 * 1.5 ** (level - 1);
//   return power - (power % 5);
// }

// async function authorize(
//   context:
//     | (MessageContext & PromptContext)
//     | (CallbackQueryContext & PromptContext),
// ) {
//   if (!context.senderId) throw new Error('Invalid senderId');
//   const user = await User.findOne({ where: { chat: context.senderId } });
//   if (user) return user;
//   const message =
//     HTML.italic(
//       'Третья мировая война заставила человечество покинуть родной дом' +
//         ' и отправиться на поиски нового, бороздя просторы бескрайней вселенной.' +
//         ' Вы управляете космическим линкором класса XL, одним из множества' +
//         ' спасательных ковчегов, которые люди построили избегая войны. Ваша' +
//         ' задача - привести колонию на борту к процветанию, наращивать производство' +
//         ' и армию, защищать колонистов. Избрать путь, по которому вы будете вести людей' +
//         ' в светлое будущее очень важно, но для начала давайте выберем название для колонии…',
//     ) + '\n\n[Напишите название вашей колонии]';
//   let { text } = await context.prompt(message, { parse_mode: 'HTML' });
//   text = (text || context.senderId.toString(16)).substring(0, 10);
//   return await User.create({ chat: context.senderId, name: text });
//   // TODO: Calculate energy, initial buildings
// }

// async function mainMenu(user: User, session: SessionContext) {
//   const message = [
//     `🚩 Колония: ${HTML.bold(user.name)}`,
//     '',
//     `💸 Кредиты: ${HTML.bold(`${user.money}`)}`,
//     // `⚡️ Энергия: ${HTML.bold(`${user.power}`)}`,
//     `💎 Минералы: ${HTML.bold(`${user.iron}`)}`,
//     `🍖 Провизия: ${HTML.bold(`${user.food}`)}`,
//   ].join('\n');
//   const keyboard = InlineKeyboard.keyboard([
//     [
//       InlineKeyboard.textButton({
//         text: '🏭 База',
//         payload: { action: Actions.base },
//       }),
//       InlineKeyboard.textButton({
//         text: '⚔️ Армия',
//         payload: { action: Actions.military },
//       }),
//     ],
//     [
//       InlineKeyboard.textButton({
//         text: '⚖️ Биржа',
//         payload: { action: Actions.trade },
//       }),
//       InlineKeyboard.textButton({
//         text: '📔 Справка',
//         payload: { action: Actions.help },
//       }),
//     ],
//     [
//       InlineKeyboard.textButton({
//         text: '🔄 Обновить',
//         payload: { action: Actions.fresh },
//       }),
//     ],
//   ]);
//   const { message_id } = await BOT.api.sendMessage({
//     text: message,
//     chat_id: user.chat,
//     reply_markup: keyboard,
//     parse_mode: 'HTML',
//   });
//   if (session.last) {
//     await BOT.api
//       .deleteMessage({
//         chat_id: user.chat,
//         message_id: session.last,
//       })
//       .catch();
//   }
//   session.last = message_id;
//   session.action = null;
// }

// async function baseMenu(user: User, session: SessionContext) {
//   const power = getPower(user.level);
//   const message = [
//     `🏭 База [${HTML.bold(` ʟᴠʟ ${user.level} `)}] ( 10 / ${power}⚡️)`,
//     '',
//     `🛠 Шахты [ ${10029} 💎]: `,
//     '  - ʟᴠʟ 1 : 100 шт. = 100 / мин',
//     '  - ʟᴠʟ 2 : 50 шт. = 100 / мин',
//     '',
//     `🐷 Фермы ( ${0} / мин ) => 🍖`,
//   ].join('\n');
//   const keyboard = InlineKeyboard.keyboard([
//     [
//       InlineKeyboard.textButton({
//         text: '📦 Собрать ресурсы',
//         payload: { action: Actions.base },
//       }),
//     ],
//     [
//       InlineKeyboard.textButton({
//         text: '🛠 Купить [ 100 💸]',
//         payload: { action: Actions.base },
//       }),
//       InlineKeyboard.textButton({
//         text: '🛠 ʟᴠʟ ᴜᴘ [ 50 💸]',
//         payload: { action: Actions.base },
//       }),
//     ],
//     [
//       InlineKeyboard.textButton({
//         text: '🐷 Купить [ 100 💸]',
//         payload: { action: Actions.base },
//       }),
//       InlineKeyboard.textButton({
//         text: '🐷 ʟᴠʟ ᴜᴘ [ 50 💸]',
//         payload: { action: Actions.base },
//       }),
//     ],
//     [
//       InlineKeyboard.textButton({
//         text: '⬅️ Назад',
//         payload: { action: Actions.back },
//       }),
//       InlineKeyboard.textButton({
//         text: '🔄 Обновить',
//         payload: { action: Actions.fresh },
//       }),
//     ],
//   ]);
//   const { message_id } = await BOT.api.sendMessage({
//     text: message,
//     chat_id: user.chat,
//     reply_markup: keyboard,
//     parse_mode: 'HTML',
//   });
//   if (session.last) {
//     await BOT.api
//       .deleteMessage({
//         chat_id: user.chat,
//         message_id: session.last,
//       })
//       .catch();
//   }
//   session.last = message_id;
//   session.action = Actions.base;
// }

// async function militaryMenu(user: User, session: SessionContext) {
//   //
// }

// async function tradeMenu(user: User, session: SessionContext) {
//   //
// }

// async function helpMenu(user: User, session: SessionContext) {
//   //
// }

// async function handleAction(
//   user: User,
//   action: Actions | null,
//   context: (MessageContext | CallbackQueryContext) &
//     PromptContext &
//     SessionInterface,
// ): Promise<{ text?: string }> {
//   switch (action) {
//     case Actions.back:
//       await mainMenu(user, context.session);
//       return {};
//     case Actions.fresh:
//       if (context.session.action) {
//         await handleAction(user, context.session.action, context);
//         return {};
//       } else {
//         await mainMenu(user, context.session);
//         return {};
//       }
//     case Actions.base:
//       await baseMenu(user, context.session);
//       return {};
//     case Actions.military:
//       break;
//     case Actions.trade:
//       break;
//     case Actions.help:
//       break;
//     default:
//       break;
//   }
//   return {};
// }

// export async function handleMessage(
//   context: MessageContext & PromptContext & SessionInterface,
// ) {
//   const user = await authorize(context);
//   if (context.session.action) {
//     await handleAction(user, context.session.action, context);
//   } else await mainMenu(user, context.session);
//   await context.delete().catch();
// }

// export async function handleCallback(
//   context: CallbackQueryContext & PromptContext & SessionInterface,
// ) {
//   const user = await authorize(context);
//   const { action = null } = <{ action: Actions }>context.queryPayload;
//   const { text } = await handleAction(user, action, context);
//   await context.answerCallbackQuery({ text });
// }

export async function handleMessage(context: MessageContext) {
  const [request, response] = await TG.prompt({
    text: 'Who are u?',
    chat_id: context.chatId,
  });
  console.log(request, response);
  // console.log(context);
}
