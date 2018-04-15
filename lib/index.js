const logger = require('./logger');
const { bot, start } = require('./bot');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

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

start();
