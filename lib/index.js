const chalk = require('chalk');
const logger = require('./logger');
const onExit = require('./utils/onExit');
const inspect = require('./utils/inspect');
const bot = require('./bot');
const config = require('../config.json');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

bot.catch(error => logger.exceptions.catcher(error));

onExit(() => stop());

function fetchInfo() {
  logger.debug('fetching bot info');
  return bot.telegram.getMe().then(botInfo => {
    logger.debug('bot info: %s', inspect(botInfo, { breakLength: Infinity }));

    bot.options.username = botInfo.username;
    bot.options.id = botInfo.id;
  });
}

function startPolling() {
  logger.info('starting');

  return fetchInfo().then(() => {
    logger.debug('starting polling');
    bot.startPolling();
    logger.info('started polling');
  });
}

function startWebhook(serverURL, port) {
  logger.info('starting');

  return fetchInfo()
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

function stop() {
  logger.info('stopping');
  return new Promise(resolve => bot.stop(resolve)).then(() =>
    logger.info('stopped')
  );
}

module.exports = { startPolling, startWebhook };
