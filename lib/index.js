const util = require('util');
const logger = require('./logger');
const bot = require('./bot');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

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
