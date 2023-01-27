import { APIError, InlineKeyboard } from 'puregram';
import Colony from '../entities/colony.entity';
import TG from '../telegram/tg.module';

export async function drawMenu(
  colony: Colony,
  text: string,
  keyboard: InlineKeyboard,
  force = false,
) {
  const edit = () =>
    TG.api.editMessageText({
      text,
      chat_id: colony.chat,
      message_id: colony.action.message,
      reply_markup: keyboard,
      parse_mode: 'HTML',
    });
  const send = () =>
    TG.api.sendMessage({
      text,
      chat_id: colony.chat,
      reply_markup: keyboard,
      parse_mode: 'HTML',
    });
  try {
    if (force) {
      if (colony.action.message) {
        await TG.api
          .deleteMessage({
            chat_id: colony.chat,
            message_id: colony.action.message,
          })
          .catch();
      }
      const { message_id } = await send();
      colony.action.message = message_id;
    } else {
      await edit();
    }
  } catch (error) {
    if (
      error instanceof APIError &&
      error.message.includes('message to edit not found')
    ) {
      const { message_id } = await send();
      colony.action.message = message_id;
    }
  }
}

// async function militaryMenu(user: User, session: SessionContext) {
//   //
// }

// async function tradeMenu(user: User, session: SessionContext) {
//   //
// }

// async function helpMenu(user: User, session: SessionContext) {
//   //
// }
