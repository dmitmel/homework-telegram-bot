const Telegraf = require('telegraf');
const Calendar = require('telegraf-calendar-telegram');
const updateLogger = require('telegraf-update-logger');
const logger = require('./logger');
const config = require('../config.json');

const bot = new Telegraf(config.bot.token);

bot.use(
  updateLogger({
    colors: true,
    log: str => logger.info(str)
  })
);

bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

const calendar = new Calendar(bot, {
  startWeekDay: 1,
  weekDayNames: ['Mn', 'Tu', 'Wd', 'Th', 'Fr', 'St', 'Sn']
});
calendar.setDateListener((ctx, date) => {
  ctx.answerCbQuery();
  ctx.reply(date);
});

bot.command('calendar', ctx => ctx.reply('Calendar:', calendar.getCalendar()));

module.exports = bot;
