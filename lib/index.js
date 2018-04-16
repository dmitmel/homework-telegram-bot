const chalk = require('chalk');
const logger = require('./logger');
const { bot, fetchBotInfo } = require('./bot');
const config = require('../config.json');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

function startPolling() {
  logger.info('starting');

  fetchBotInfo()
    .then(() => {
      logger.debug('removing webhook from the telegram bot');
      return bot.telegram.deleteWebhook();
    })
    .then(() => {
      logger.debug('starting polling');
      bot.startPolling();
      logger.info('started polling');
    });
}

function startWebhook(serverURL, port) {
  logger.info('starting');

  fetchBotInfo()
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
    });
}

module.exports = { startPolling, startWebhook };
