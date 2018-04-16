const chalk = require('chalk');
const logger = require('./logger');
const { onExit } = require('./exit');
const { bot, fetchBotInfo } = require('./bot');
const config = require('../config.json');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

onExit(({ code, signal }) => {
  if (signal) logger.debug('received signal %s', signal);
  logger.info('exiting with code %d', code);
});

onExit(() => {
  logger.info('stopping');
  return new Promise(resolve => bot.stop(resolve)).then(() => {
    logger.info('stopped');
  });
});

function startPolling() {
  logger.info('starting');

  return fetchBotInfo().then(() => {
    logger.debug('starting polling');
    bot.startPolling();
    logger.info('started polling');
  });
}

function startWebhook(serverURL, port) {
  logger.info('starting');

  return fetchBotInfo()
    .then(() => {
      logger.debug('adding webhook to the telegram bot');
      return bot.telegram.setWebhook(`${serverURL}${config.bot.webhookPath}`);
    })
    .then(() => {
      logger.debug('starting webhook');
      bot.startWebhook(config.bot.webhookPath, null, port);
      logger.info(
        'webhook is listening on %s',
        chalk.cyan(`${serverURL}:${port}`)
      );

      onExit(() => {
        logger.debug('removing webhook from the telegram bot');
        return bot.telegram.deleteWebhook();
      });
    });
}

module.exports = { startPolling, startWebhook };
