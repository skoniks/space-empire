import { Transaction } from 'sequelize';
import Action from '../entities/action.entity';
import Colony from '../entities/colony.entity';
import Factory, { FactoryType } from '../entities/factory.entity';
import TG from '../telegram/tg.module';

export async function authorize(
  chat_id: number,
  transaction?: Transaction,
): Promise<Colony> {
  let colony = await Colony.findOne({
    where: { chat: chat_id },
    include: [Action, Factory],
    transaction,
    lock: true,
  });
  if (colony) return colony;

  const lines = [
    '<i>Третья мировая война заставила человечество покинуть родной дом' +
      ' и отправиться на поиски нового, бороздя просторы бескрайней вселенной.' +
      ' Вы управляете космическим линкором класса XL, одним из множества' +
      ' спасательных ковчегов, которые люди построили избегая войны. Ваша' +
      ' задача - привести колонию на борту к процветанию, наращивать производство' +
      ' и армию, защищать колонистов. Избрать путь, по которому вы будете вести людей' +
      ' в светлое будущее очень важно, но для начала давайте выберем название для колонии…</i>',
    '',
    '',
    '[📝 название вашей колонии]',
  ];

  const { message_id } = await TG.api.sendMessage({
    text: lines.join('\n'),
    chat_id,
    parse_mode: 'HTML',
  });
  try {
    const { id, text } = await TG.prompt(chat_id);
    await TG.api.deleteMessage({ chat_id, message_id: id }).catch();
    const name = (text || chat_id.toString(16)).substring(0, 10);
    colony = await Colony.create({ chat: chat_id, name }, { transaction });
    await Action.create(
      { colonyId: colony.id, message: message_id },
      { transaction },
    );
    await Factory.bulkCreate(
      [
        { colonyId: colony.id, type: FactoryType.mine, count: 1, level: 1 },
        { colonyId: colony.id, type: FactoryType.farm, count: 1, level: 1 },
      ],
      { transaction },
    );
    return await colony.reload({
      include: [Action, Factory],
      transaction,
      lock: true,
    });
  } catch (error) {
    await TG.api.deleteMessage({ chat_id, message_id }).catch();
    return await authorize(chat_id, transaction);
  }
}
