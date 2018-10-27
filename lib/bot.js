const Telegraf = require('telegraf');
const Calendar = require('telegraf-calendar-telegram');
const updateLogger = require('telegraf-update-logger');
const logger = require('./logger');
const config = require('../config.json');

const { getHomeworkForDate, postHomework } = require('./homework');
const ask = require('./middleware/ask');
const calendar = require('./commands/calendar');
const today = require('./commands/today');
const tomorrow = require('./commands/tomorrow');

const bot = new Telegraf(config.bot.token);

bot.context.ask = ask;

bot.use(
  updateLogger({
    colors: true,
    log: str => logger.info(str)
  })
);

bot.command('cancel', ask.cancel());
bot.use(ask.middleware());

bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

const datePicker = new Calendar(bot, {
  startWeekDay: 1,
  weekDayNames: ['Mn', 'Tu', 'Wd', 'Th', 'Fr', 'St', 'Sn']
});

datePicker.setDateListener(async (ctx, date) => {
  await ctx.answerCbQuery();
  const posts = await getHomeworkForDate(date);

  return Promise.all(
    posts.map(post =>
      ctx.telegram.forwardMessage(ctx.chat.id, ctx.chat.id, post.message)
    )
  );
});

bot.command('calendar', calendar(datePicker));

bot.command('today', today());
bot.command('tomorrow', tomorrow());

bot.command('post', ctx => {
  const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]*)$/i;
  const parts = regex.exec(ctx.message.text);
  if (parts) {
    const date = parts[3];
    ctx.reply('Please, send a text/photo/video/document').then(() =>
      ctx
        .ask({
          validator: answer =>
            answer.text || answer.photo || answer.video || answer.document,
          onInvalid: () => ctx.reply('Please, send a text/photo/video/document')
        })
        .then(message => postHomework(date, message.message_id))
    );
  }
});

module.exports = bot;
