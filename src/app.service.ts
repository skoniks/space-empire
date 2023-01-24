import { PromptContext } from '@puregram/prompt';
import { SessionContext } from '@puregram/session';
import { CallbackQueryContext, MessageContext } from 'puregram';

export async function handleMessage(
  context: MessageContext & PromptContext & SessionContext,
) {
  console.log(context);
}

export async function handleCallback(
  context: CallbackQueryContext & PromptContext & SessionContext,
) {
  console.log(context);
}
