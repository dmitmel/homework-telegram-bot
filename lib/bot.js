const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');
const logger = require('./logger');
const config = require('../config.json');

const calendar = require('./commands/calendar');
const post = require('./commands/post');
const ask = require('./middleware/ask');
const datePicker = require('./middleware/datePicker');

const bot = new Telegraf(config.bot.token);

bot.use(updateLogger({ colors: true, log: str => logger.info(str) }));

ask(bot);
datePicker(bot);

bot.command('calendar', calendar());
bot.command('post', post());

module.exports = bot;
