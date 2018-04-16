const Telegraf = require('telegraf');
const logger = require('./logger');
const config = require('../config.json');

const bot = new Telegraf(config.bot.token);

bot.catch(error => {
  // log error
  logger.exceptions.catcher(error);

  // a string is thrown here, because:
  // 1. it prevents Telegraf from marking an event (which caused this error) as
  //    processed
  // 2. it does not add a stack trace to the error message (the error has been
  //    already logged)
  throw '(see error above)'; // eslint-disable-line no-throw-literal
});

bot.on('message', ctx => ctx.reply(ctx.message.text));

module.exports = bot;
