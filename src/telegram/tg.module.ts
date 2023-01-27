import { MessageContext, Telegram } from 'puregram';
import { handleCallback, handleMessage } from '../app/app.service';

class MyTelegram extends Telegram {
  private prompts: Record<string, (context: MessageContext) => void> = {};

  handlePrompts(context: MessageContext): boolean {
    if (!this.prompts[context.chatId]) return false;
    this.prompts[context.chatId](context);
    return true;
  }

  async prompt(chatId: number): Promise<MessageContext> {
    try {
      const context = await new Promise(
        (resolve: (context: MessageContext) => void, reject) => {
          setTimeout(() => reject(), 60 * 1000);
          this.prompts[chatId] = resolve;
        },
      );
      delete this.prompts[chatId];
      return context;
    } catch (error) {
      delete this.prompts[chatId];
      throw error;
    }
  }
}

const TG = new MyTelegram({ token: process.env.TOKEN || '' });
TG.updates.on('callback_query', handleCallback);
TG.updates.on('message', (context) => {
  if (TG.handlePrompts(context)) return;
  handleMessage(context);
});

export default TG;
