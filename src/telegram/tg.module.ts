import { MessageContext, Telegram } from 'puregram';
import { SendMessageParams } from 'puregram/generated';
import { handleMessage } from '../app/app.service';

class MyTelegram extends Telegram {
  private prompts: Record<string, (context: MessageContext) => void> = {};

  handlePrompts(context: MessageContext) {
    if (!this.prompts[context.chatId]) return false;
    this.prompts[context.chatId](context);
    return true;
  }

  async prompt(params: SendMessageParams) {
    const request = await TG.api.sendMessage(params);
    const response = await new Promise((resolve) => {
      this.prompts[params.chat_id] = resolve;
    });
    return [request, response];
  }
}

const TG = new MyTelegram({ token: process.env.TOKEN || '' });
// TG.updates.on('callback_query', handleCallback);
TG.updates.on('message', (context) => {
  if (TG.handlePrompts(context)) return;
  handleMessage(context);
});

export default TG;
