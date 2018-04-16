const logger = require('./logger');
const { bot, fetchBotInfo } = require('./bot');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

logger.info('starting');

fetchBotInfo().then(() => {
  logger.debug('starting polling');
  bot.startPolling();
  logger.info('started polling');
});
