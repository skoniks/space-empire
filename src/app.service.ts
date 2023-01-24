import { PromptContext } from '@puregram/prompt';
import { SessionContext } from '@puregram/session';
import {
  CallbackQueryContext,
  HTML,
  InlineKeyboard,
  MessageContext,
} from 'puregram';
import BOT from './bot.module';
import User from './entities/user.entity';

enum Actions {
  back,
  fresh,
  colony,
  military,
  trade,
  help,
}

async function authorize(
  context:
    | (MessageContext & PromptContext)
    | (CallbackQueryContext & PromptContext),
) {
  if (!context.senderId) throw new Error('Invalid senderId');
  const user = await User.findOne({ where: { chat: context.senderId } });
  if (user) return user;
  const message =
    HTML.italic(
      'Третья мировая война заставила человечество покинуть родной дом,' +
        ' и отправиться на поиски нового, бороздя просторы бескрайней вселенной.' +
        ' Вы управляете космическим линкором класса XL, одним из множества' +
        ' спасательных ковчегов, которые люди построили избегая войны. Ваша' +
        ' задача - привести колонию на борту к процветанию, наращивать производство' +
        ' и армию, защищать колонистов. Избрать путь, по которому вы будете вести людей' +
        ' в светлое будущее очень важно, но для начала давайте выберем название для колонии…',
    ) + '\n\n[Напишите название вашей колонии]';
  let { text } = await context.prompt(message, { parse_mode: 'HTML' });
  text = (text || context.senderId.toString(16)).substring(0, 10);
  return await User.create({ chat: context.senderId, name: text });
}

async function mainMenu(
  context:
    | (MessageContext & SessionContext)
    | (CallbackQueryContext & SessionContext),
  user: User,
) {
  if (!context.senderId) throw new Error('Invalid senderId');
  const message = [
    `🚩 Колония:  ${HTML.bold(user.name)} [LVL ${user.level}]\n`,
    `💸 Кредиты:      ${HTML.bold(`${user.money}`)}`,
    `⚡️ Энергия:       ${HTML.bold(`${user.power}`)}`,
    `💎 Минералы:  ${HTML.bold(`${user.iron}`)}`,
    `🍖 Провизия:    ${HTML.bold(`${user.food}`)}`,
  ].join('\n');
  const keyboard = InlineKeyboard.keyboard([
    [
      InlineKeyboard.textButton({
        text: '🚩 Колония',
        payload: { action: Actions.colony },
      }),
      InlineKeyboard.textButton({
        text: '⚔️ Армия',
        payload: { action: Actions.military },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '⚖️ Биржа',
        payload: { action: Actions.trade },
      }),
      InlineKeyboard.textButton({
        text: '📔 Справка',
        payload: { action: Actions.help },
      }),
    ],
    [
      InlineKeyboard.textButton({
        text: '🔄 Обновить',
        payload: { action: Actions.fresh },
      }),
    ],
  ]);
  const { message_id } = await BOT.api.sendMessage({
    chat_id: context.senderId,
    text: message,
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
  if (context.session.last) {
    await BOT.api.deleteMessage({
      chat_id: context.senderId,
      message_id: context.session.last,
    });
  }
  context.session.last = message_id;
  context.session.context = null;
}

export async function handleMessage(
  context: MessageContext & PromptContext & SessionContext,
) {
  const user = await authorize(context);
  if (context.session.context) {
    //
  } else {
    await mainMenu(context, user);
    await context.delete().catch();
  }
}

export async function handleCallback(
  context: CallbackQueryContext & PromptContext & SessionContext,
) {
  const user = await authorize(context);
  const { action } = <{ action: Actions }>context.queryPayload;
  switch (action) {
    case Actions.back:
      break;
    case Actions.fresh:
      if (context.session.context) {
        //
      } else await mainMenu(context, user);
      break;
    case Actions.colony:
      break;
    case Actions.military:
      break;
    case Actions.trade:
      break;
    case Actions.help:
      break;
    default:
      break;
  }
  await context.answerCallbackQuery();
}
