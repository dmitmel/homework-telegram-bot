const Calendar = require('telegraf-calendar-telegram');
const messageLogger = require('./middleware/messageLogger');

function setupMiddleware(bot) {
  const calendar = new Calendar(bot, { startWeekDay: 1 });
  calendar.setDateListener((ctx, date) => ctx.reply(date));

  bot.use(messageLogger());

  bot.command('calendar', ctx =>
    ctx.reply('Calendar:', calendar.getCalendar())
  );

  bot.on('text', ctx => ctx.reply(ctx.message.text));
}

module.exports = setupMiddleware;
