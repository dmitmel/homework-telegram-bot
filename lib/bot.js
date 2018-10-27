const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const updateLogger = require('telegraf-update-logger');

const logger = require('./logger');
const config = require('../config.json');

const calendar = require('./scenes/calendar');
const post = require('./scenes/post');

const bot = new Telegraf(config.bot.token);

bot.use(updateLogger({ colors: true, log: str => logger.info(str) }));

const stage = new Stage([calendar, post]);
stage.command('cancel', ctx => ctx.scene.leave());

bot.use(session());
bot.use(stage.middleware());

bot.command('calendar', ctx => ctx.scene.enter('calendar'));
bot.command('post', ctx => ctx.scene.enter('post'));

bot.use((_ctx, next) => {
  logger.info('handler not found');
  return next();
});

module.exports = bot;
