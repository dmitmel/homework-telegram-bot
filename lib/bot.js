const Telegraf = require('telegraf');
const Calendar = require('telegraf-calendar-telegram');
const updateLogger = require('telegraf-update-logger');
const logger = require('./logger');
const config = require('../config.json');

const { getHomeworkForDate } = require('./homework');
const calendar = require('./commands/calendar');
const today = require('./commands/today');
const tomorrow = require('./commands/tomorrow');

const bot = new Telegraf(config.bot.token);

bot.context.replyWithHomework = function replyWithHomework(date) {
  return getHomeworkForDate(date).then(
    homework => (homework ? this.reply(homework) : Promise.resolve())
  );
};

bot.use(
  updateLogger({
    colors: true,
    log: str => logger.info(str)
  })
);

bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

const datePicker = new Calendar(bot, {
  startWeekDay: 1,
  weekDayNames: ['Mn', 'Tu', 'Wd', 'Th', 'Fr', 'St', 'Sn']
});

datePicker.setDateListener((ctx, date) =>
  ctx.replyWithHomework(date).then(() => ctx.answerCbQuery())
);

bot.command('calendar', calendar(datePicker));

bot.command('today', today());
bot.command('tomorrow', tomorrow());

module.exports = bot;
