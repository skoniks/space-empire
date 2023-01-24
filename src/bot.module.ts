import { Telegram } from 'puregram';

const BOT = Telegram.fromToken(process.env.TOKEN || '');

export default BOT;
