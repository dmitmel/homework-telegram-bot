const util = require('util');
const Telegraf = require('telegraf');
const logger = require('./logger');
const config = require('../config.json');

const bot = new Telegraf(config.bot.token);

bot.on('message', ctx => ctx.reply(ctx.message.text));

function start() {
  logger.info('starting');

  logger.debug('fetching bot info');
  bot.telegram.getMe().then(botInfo => {
    logger.debug(
      'bot info %s',
      util.inspect(botInfo, { colors: true, breakLength: Infinity })
    );

    bot.options.username = botInfo.username;
    bot.options.id = botInfo.id;

    logger.debug('starting polling');
    bot.startPolling();
    logger.info('started polling');
  });
}

module.exports = {
  bot,
  start
};
