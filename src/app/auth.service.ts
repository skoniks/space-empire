import { HTML } from 'puregram';
import { Transaction } from 'sequelize';
import User from '../entities/user.entity';
import TG from '../telegram/tg.module';

export async function authorize(chat_id: number, transaction?: Transaction) {
  let user = await User.findOne({
    where: { chat: chat_id },
    transaction,
    lock: true,
  });
  if (user) return user;
  const text =
    HTML.italic(
      'Третья мировая война заставила человечество покинуть родной дом' +
        ' и отправиться на поиски нового, бороздя просторы бескрайней вселенной.' +
        ' Вы управляете космическим линкором класса XL, одним из множества' +
        ' спасательных ковчегов, которые люди построили избегая войны. Ваша' +
        ' задача - привести колонию на борту к процветанию, наращивать производство' +
        ' и армию, защищать колонистов. Избрать путь, по которому вы будете вести людей' +
        ' в светлое будущее очень важно, но для начала давайте выберем название для колонии…',
    ) + '\n\n[Напишите название вашей колонии]';
  const { message_id } = await TG.api.sendMessage({
    text,
    chat_id,
    parse_mode: 'HTML',
  });
  const res = await TG.prompt(chat_id);
  if (message_id) await TG.api.deleteMessage({ chat_id, message_id }).catch();
  if (res) await TG.api.deleteMessage({ chat_id, message_id: res.id }).catch();
  const name = (res?.text || chat_id.toString(16)).substring(0, 10);
  user = await User.create({ chat: chat_id, name }, { transaction });
  return await user.reload({ transaction, lock: true });
  // TODO: Calculate energy, initial buildings
}
