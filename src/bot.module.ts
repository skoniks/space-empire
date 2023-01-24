import { PromptManager } from '@puregram/prompt';
import { SessionManager } from '@puregram/session';
import { Telegram } from 'puregram';
import { handleCallback, handleMessage } from './app.service';

const BOT = Telegram.fromToken(process.env.TOKEN || '');
const promptManager = new PromptManager();
const sessionManager = new SessionManager();
BOT.updates.use(promptManager.middleware);
BOT.updates.use(sessionManager.middleware);
BOT.updates.on('message', handleMessage);
BOT.updates.on('callback_query', handleCallback);

export default BOT;
