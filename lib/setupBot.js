const Calendar = require('telegraf-calendar-telegram');
const updateLogger = require('telegraf-update-logger');
const logger = require('./logger');

function setupBot(bot) {
  bot.use(updateLogger({ colors: true, log: str => logger.info(str) }));

  bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

  const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['Mn', 'Tu', 'Wd', 'Th', 'Fr', 'St', 'Sn']
  });
  calendar.setDateListener((ctx, date) => {
    ctx.answerCbQuery();
    ctx.reply(date);
  });

  bot.command('calendar', ctx =>
    ctx.reply('Calendar:', calendar.getCalendar())
  );

  bot.on('text', ctx => ctx.reply(ctx.message.text));
}

module.exports = setupBot;
