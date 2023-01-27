import { MessageContext, Telegram } from 'puregram';
import { handleCallback, handleMessage } from '../app/app.service';

class MyTelegram extends Telegram {
  private prompts: Record<string, (context?: MessageContext) => void> = {};

  handlePrompts(context: MessageContext): boolean {
    if (!this.prompts[context.chatId]) return false;
    this.prompts[context.chatId](context);
    return true;
  }

  async prompt(chatId: number): Promise<MessageContext | undefined> {
    const context = await new Promise(
      (resolve: (context?: MessageContext) => void) => {
        setTimeout(() => resolve(undefined), 60 * 1000);
        this.prompts[chatId] = resolve;
      },
    );
    delete this.prompts[chatId];
    return context;
  }
}

const TG = new MyTelegram({ token: process.env.TOKEN || '' });
TG.updates.on('callback_query', handleCallback);
TG.updates.on('message', (context) => {
  if (TG.handlePrompts(context)) return;
  handleMessage(context);
});

export default TG;
