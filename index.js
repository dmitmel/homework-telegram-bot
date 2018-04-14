const Telegraf = require('telegraf');
const logger = require('./lib/logger');
const config = require('./config.json');

const bot = new Telegraf(config.bot.token);

bot.on('message', ctx => {
  ctx.reply(ctx.message.text);
});

logger.info('starting');

bot.telegram.getMe().then(({ username, id }) => {
  bot.options.username = username;
  bot.options.id = id;
  logger.info(`connected to bot @${username}`);

  bot.startPolling();
  logger.info('started polling');
});
