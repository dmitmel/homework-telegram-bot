const chalk = require('chalk');
const Telegraf = require('telegraf');
const setupMiddleware = require('./setupMiddleware');
const logger = require('./logger');
const onExit = require('./onExit');
const inspect = require('./utils/inspect');
const config = require('../config.json');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

function handleTelegrafError(error) {
  logger.exceptions.catcher(error);
  process.exit(1);
}

class Bot extends Telegraf {
  constructor() {
    super(config.bot.token);
    this.catch(handleTelegrafError);

    setupMiddleware(this);

    onExit(() => this.stop());
  }

  fetchInfo() {
    logger.debug('fetching bot info');
    return this.telegram.getMe().then(botInfo => {
      logger.debug('bot info: %s', inspect(botInfo, { breakLength: Infinity }));

      this.options.username = botInfo.username;
      this.options.id = botInfo.id;
    });
  }

  startPolling() {
    logger.info('starting');

    return this.fetchInfo().then(() => {
      logger.debug('starting polling');
      super.startPolling();
      logger.info('started polling');
    });
  }

  startWebhook(serverURL, port) {
    logger.info('starting');

    return this.fetchInfo()
      .then(() => {
        logger.debug('adding webhook to the telegram bot');
        return this.telegram.setWebhook(
          `${serverURL}${config.bot.webhookPath}`
        );
      })
      .then(() => {
        logger.debug('starting webhook');
        super.startWebhook(config.bot.webhookPath, null, port);
        logger.info(
          'webhook is listening on %s',
          chalk.cyan(`${serverURL}:${port}`)
        );

        onExit(() => {
          logger.debug('removing webhook from the telegram bot');
          return this.telegram.deleteWebhook();
        });
      });
  }

  stop() {
    logger.info('stopping');
    return new Promise(resolve => super.stop(resolve)).then(() =>
      logger.info('stopped')
    );
  }
}

module.exports = Bot;
